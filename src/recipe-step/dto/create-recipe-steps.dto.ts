import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class SingleRecipeStepDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 16)
  tool: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 16)
  ingredient: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 16)
  technique: string;
}

export class CreateRecipeStepsDto {
  steps: SingleRecipeStepDto[];
}
