import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserTagSubscriptionDto {
  @IsNotEmpty()
  tagId: string;
}
