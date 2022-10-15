import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthSignInDTO } from './dto/authSignIn.dto';
import { Response, Request } from 'express';
import { AuthEmailValidationDto } from './dto/authEmailValidation.dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDTO) {
    return this.AuthService.signup(dto);
  }

  @Post('validateEmail')
  validateEmail(@Body() dto: AuthEmailValidationDto) {
    return this.AuthService.validateEmail(dto);
  }

  //override login 201 code with 200 code
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Res() res: Response, @Body() dto: AuthSignInDTO) {
    return this.AuthService.signin(dto, res);
  }

  @Get('refreshToken')
  refreshToken(@Req() request: Request, @Res() response: Response) {
    return this.AuthService.refreshToken(request, response);
  }
}
