import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { CreateRecipeStepsDto } from 'src/recipe-step/dto/create-recipe-steps.dto';

export class CreateRecipeWithStepsDto {
  recipes: [
    {
      recipeFor: string;
      steps: { instruction: string }[];
    },
  ];
}
