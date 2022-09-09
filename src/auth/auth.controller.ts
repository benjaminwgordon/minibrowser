import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthSignInDTO } from './dto/authSignIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDTO) {
    return this.AuthService.signup(dto);
  }

  //override login 201 code with 200 code
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthSignInDTO) {
    return this.AuthService.signin(dto);
  }
}
