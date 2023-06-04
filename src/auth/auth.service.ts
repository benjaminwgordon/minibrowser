import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { AuthDTO } from "./dto/auth.dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { pendingUser, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ConfigService } from "@nestjs/config";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { Response, Request } from "express";
import jwt_decode from "jwt-decode";
import { AuthEmailValidationDto } from "./dto/authEmailValidation.dto";
import { PrismaService } from "../prisma/prisma.service";
import { STATUS_CODES } from "node:http";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  // creates a new pending user, adding them to the list of pending users awaiting email confirmation
  async signup(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    var crypto = require("crypto");
    const confirmationCode = crypto.randomBytes(6).toString("hex");
    try {
      const user: User = await this.prisma.pendingUser.upsert({
        where: {
          email: dto.email,
        },
        update: {
          confirmationCode: confirmationCode,
          hash,
        },
        create: {
          email: dto.email,
          username: dto.username.toLowerCase(),
          hash: hash,
          confirmationCode: confirmationCode,
        },
      });

      this.sendConfirmationEmail(dto.username, dto.email, confirmationCode);

      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // uniqueness constraint failed
        if (error.code === "P2002") {
          throw new ForbiddenException("credentials taken");
        }
      }
    }
  }

  // alternate path for user registration that skips the email verification.  Used only for local development environments that can't access the sendGrid API
  async skipUserEmailValidationSignup(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    var crypto = require("crypto");
    const confirmationCode = crypto.randomBytes(6).toString("hex");

    // check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException("account with email address already exists");
    } else {
      try {
        const addedUser = await this.prisma.user.create({
          data: {
            email: dto.email,
            username: dto.username,
            hash: hash,
          },
        });

        return HttpStatus.ACCEPTED;
      } catch {
        throw new InternalServerErrorException(
          "unknown error during user creation"
        );
      }
    }
  }

  // sends an email to confirm email account ownership
  async sendConfirmationEmail(
    username: string,
    userEmail: string,
    confirmationCode: string
  ) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.GRID_KEY);

    const msg = {
      to: userEmail, // Change to your recipient
      from: "miniaturesbrowser@gmail.com", // Change to your verified sender
      subject: "Confirm your MiniBrowser Account",
      text: `Welcome to MiniBrowser!
         \n
         Here is your activation code:\n
         ${confirmationCode}`,
    };

    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // fired when a user clicks an email confirmation link.  If valid, converts the user from a pending user into a full user
  async validateEmail(dto: AuthEmailValidationDto) {
    const { email, confirmationCode } = dto;
    try {
      const user: pendingUser = await this.prisma.pendingUser.findUniqueOrThrow(
        {
          where: {
            email: email,
          },
        }
      );
      console.log({
        serverCode: user.confirmationCode,
        clientCode: dto.confirmationCode,
      });
      if (user.confirmationCode !== confirmationCode) {
        throw new ForbiddenException("Invalid code");
      } else {
        // remove user from PendingUsers and append to Users
        const removedUser = await this.prisma.pendingUser.delete({
          where: {
            email: user.email,
          },
        });

        const addedUser = await this.prisma.user.create({
          data: {
            email: removedUser.email,
            username: removedUser.username,
            hash: removedUser.hash,
          },
        });

        return HttpStatus.ACCEPTED;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async signin(dto: AuthSignInDTO, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException("This account does not exist");
    }

    const pwMatch = await argon.verify(user.hash, dto.password);

    if (!pwMatch) {
      throw new ForbiddenException("Incorrect Credentials");
    }

    const authToken = await this.signToken(user.id, user.email, "15m");
    const refreshToken = await this.signToken(user.id, user.email, "30d");

    const future = new Date();
    future.setDate(future.getDate() + 30);

    res.cookie("jwt", authToken, {
      path: "/",
      sameSite: "none",
      expires: future,
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      path: "/",
      sameSite: "none",
      expires: future,
      secure: true,
    });

    res.send({ access_token: authToken });
  }

  async signToken(
    userId: number,
    email: string,
    expiresIn: string
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });

    return token;
  }

  async refreshToken(request: Request, response: Response) {
    const priorRefreshToken = request.cookies["refreshToken"];

    if (!priorRefreshToken) {
      throw new ForbiddenException(
        "refresh token not set, sign in again to continue"
      );
    }

    interface IJwt {
      email: string;
      exp: string;
    }

    const decodedRefreshToken = jwt_decode(priorRefreshToken) as IJwt;
    const userEmail = decodedRefreshToken.email;
    const expirationTime = parseInt(decodedRefreshToken.exp);

    const date = new Date();
    const currentTime = Math.floor(date.getTime() / 1000);

    if (currentTime > expirationTime) {
      throw new ForbiddenException(
        "refresh token expired, sign in again to continue"
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    // if refreshToken is not expired and matches a valid user, issue a new authToken and refreshToken
    if (!user) {
      throw new ForbiddenException("no user found matches this refresh token");
    }

    const newAuthToken = await this.signToken(user.id, user.email, "15m");
    const newRefreshToken = await this.signToken(user.id, user.email, "30d");

    const future = new Date();
    future.setDate(future.getDate() + 30);

    response.cookie("jwt", newAuthToken, {
      path: "/",
      sameSite: "none",
      expires: future,
      secure: true,
    });

    response.cookie("refreshToken", newRefreshToken, {
      path: "/",
      sameSite: "none",
      expires: future,
      secure: true,
    });

    response.send({ access_token: newAuthToken });
  }

  async logout(request: Request, response: Response) {
    console.log("logout request");
    const past = new Date();
    past.setDate(past.getDate() - 300);

    response.cookie("jwt", "", {
      path: "/",
      sameSite: "none",
      expires: past,
      secure: true,
    });

    response.cookie("refreshToken", "", {
      path: "/",
      sameSite: "none",
      expires: past,
      secure: true,
    });

    response.status(200).send({ msg: "Logged out" });
  }
}
