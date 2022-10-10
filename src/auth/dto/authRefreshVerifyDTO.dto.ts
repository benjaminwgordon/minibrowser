import { IsString, IsNotEmpty } from 'class-validator';

export class AuthRefreshVerifyDTO {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
