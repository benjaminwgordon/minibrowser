export class CreateRecipeWithStepsDto {
  recipes: [
    {
      recipeFor: string;
      steps: { instruction: string }[];
    },
  ];
}
