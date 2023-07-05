import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateRecipeWithoutStepsDTO {
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  recipeFor: string;
}
