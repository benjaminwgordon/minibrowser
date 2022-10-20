import { Injectable, ForbiddenException } from '@nestjs/common';
import { RecipeStep, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeStepsDto } from './dto/create-recipe-steps.dto';

@Injectable()
export class RecipeStepService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: User,
    recipeId: number,
    createRecipeStepsDto: CreateRecipeStepsDto,
  ): Promise<RecipeStep[]> {
    console.log({ createRecipeStepsDto });
    console.log({ user });
    try {
      const recipe = await this.prisma.recipe.findUnique({
        where: {
          id: recipeId,
        },
        include: {
          post: {
            include: {
              author: true,
            },
          },
        },
      });
      //only add steps if the user owns the recipe
      if (!recipe || !(recipe.post.authorId === user.id)) {
        throw new ForbiddenException(
          'Cannot add steps to recipes you do not own',
        );
      }

      // append the recipeId to each recipeStep from the request URL
      const data = createRecipeStepsDto.steps.map((recipeStep) => ({
        ...recipeStep,
        recipeId,
      }));

      const newRecipeSteps = await this.prisma.recipeStep.createMany({
        data: data,
      });

      console.log({ newRecipeSteps });
      console.log({ recipeStepType: typeof newRecipeSteps });
      // return newRecipeSteps;
      return;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(recipeId: number): Promise<RecipeStep[]> {
    const allSteps = await this.prisma.recipeStep.findMany({
      where: {
        recipeId: recipeId,
      },
    });
    return allSteps;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipeStep`;
  }

  // update(id: number, updateRecipeStepDto: UpdateRecipeStepDto) {
  //   return `This action updates a #${id} recipeStep`;
  // }

  remove(id: number) {
    return `This action removes a #${id} recipeStep`;
  }
}
