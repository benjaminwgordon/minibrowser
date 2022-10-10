import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { AuthSignInDTO } from './dto/authSignIn.dto';
import { Response, Request } from 'express';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user: User = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // uniqueness constraint failed
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
    }
  }

  async signin(dto: AuthSignInDTO, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    console.log({ user });

    if (!user) {
      throw new ForbiddenException('This account does not exist');
    }

    const pwMatch = await argon.verify(user.hash, dto.password);

    if (!pwMatch) {
      throw new ForbiddenException('Incorrect Credentials');
    }

    const authToken = await this.signToken(user.id, user.email, '15m');
    const refreshToken = await this.signToken(user.id, user.email, '30d');

    const future = new Date();
    future.setDate(future.getDate() + 30);

    res.cookie('refreshToken', refreshToken, {
      expires: future,
      httpOnly: true,
      secure: false,
    });

    res.send({ access_token: authToken });
  }

  async signToken(
    userId: number,
    email: string,
    expiresIn: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn,
      secret,
    });

    return token;
  }

  async refreshToken(request: Request, response: Response) {
    const priorRefreshToken = request.cookies['refreshToken'];

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
        'refresh token expired, sign in again to continue',
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
      throw new ForbiddenException('no user found matches this refresh token');
    }

    const newAuthToken = await this.signToken(user.id, user.email, '15m');
    const newRefreshToken = await this.signToken(user.id, user.email, '30d');

    const future = new Date();
    future.setDate(future.getDate() + 30);

    response.cookie('refreshToken', newRefreshToken, {
      expires: future,
      httpOnly: true,
      secure: false,
    });

    response.send({ access_token: newAuthToken });
  }
}
