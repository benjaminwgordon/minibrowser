import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthDTO } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { Response, Request } from "express";
import { AuthEmailValidationDto } from "./dto/authEmailValidation.dto";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private AuthService: AuthService,
    private ConfigService: ConfigService
  ) {}

  @Post("signup")
  signup(@Body() dto: AuthDTO) {
    // user registration service differs depending on prod vs dev environments
    // (no email verification for accounts created on dev environment)
    const ENV = this.ConfigService.get<string>("NODE_ENV");
    if (ENV == "production") {
      return this.AuthService.signup(dto);
    } else {
      return this.AuthService.skipUserEmailValidationSignup(dto);
    }
  }

  @Post("validateEmail")
  validateEmail(@Body() dto: AuthEmailValidationDto) {
    return this.AuthService.validateEmail(dto);
  }

  //override login 201 code with 200 code
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signin(@Res() res: Response, @Body() dto: AuthSignInDTO) {
    return this.AuthService.signin(dto, res);
  }

  @Get("refreshToken")
  refreshToken(@Req() request: Request, @Res() response: Response) {
    return this.AuthService.refreshToken(request, response);
  }

  @Get("logout")
  logout(@Req() request: Request, @Res() response: Response) {
    return this.AuthService.logout(request, response);
  }
}
