import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AuthEmailValidationDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  confirmationCode: string;
}
