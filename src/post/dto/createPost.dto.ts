import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 63)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  file: Express.Multer.File;
}
