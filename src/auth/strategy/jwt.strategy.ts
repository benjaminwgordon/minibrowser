import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET"),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let extractedJwt = request?.headers["authorization"].split(" ")[1];
          if (!extractedJwt) {
            return null;
          }
          return extractedJwt;
        },
      ]),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    // this object is appended to req.user, this delete avoids sending the hashed password down to the client
    delete user.hash;
    return user;
  }
}
