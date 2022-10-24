import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class SingleRecipeStepDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 80)
  instruction: string;
}

export class CreateRecipeStepsDto {
  steps: SingleRecipeStepDto[];
}
