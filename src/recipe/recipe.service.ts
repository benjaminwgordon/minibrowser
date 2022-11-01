import { Injectable } from '@nestjs/common';
import { Recipe } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeWithStepsDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(
    postId: number,
    createRecipeWithStepsDto: CreateRecipeWithStepsDto,
  ): Promise<any> {
    // THIS IS SLOW, but prisma but not yet support nested writes with createMany
    const allRecipesWithSteps = await Promise.all(
      createRecipeWithStepsDto.recipes.map(async (recipe) => {
        const { recipeFor, steps } = recipe;
        const recipeWithSteps = await this.prisma.recipe.create({
          data: {
            post: {
              connect: { id: postId },
            },
            recipeFor,
            RecipeStep: {
              create: steps,
            },
          },
          include: {
            RecipeStep: true,
          },
        });
        return recipeWithSteps;
      }),
    );
    console.log({ allRecipesWithSteps });
    return allRecipesWithSteps;
  }

  async findAll(postId: number) {
    const recipesForPost = await this.prisma.recipe.findMany({
      where: {
        postId,
      },
      include: {
        RecipeStep: true,
      },
    });
    return recipesForPost;
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        id: id,
      },
    });
    return recipe;
  }

  // update(id: number, updateRecipeDto: UpdateRecipeDto) {
  //   return `This action updates a #${id} recipe`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} recipe`;
  // }
}
