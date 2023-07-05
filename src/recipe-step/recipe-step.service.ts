import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, RecipeStep, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import CreateRecipeStepDto from "./dto/create-recipe-steps.dto";
import { NotFoundError } from "@prisma/client/runtime";

@Injectable()
export class RecipeStepService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: User,
    recipeId: number,
    createRecipeStepDto: CreateRecipeStepDto
  ): Promise<RecipeStep> {
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

    if (!recipe) {
      throw new NotFoundException("No recipe exists with this id");
    }

    //throw forbidden exception if user doesn't own the recipe they are adding steps to
    if (!recipe || !(recipe.post.authorId === user.id)) {
      throw new ForbiddenException(
        "Cannot add steps to recipes you do not own"
      );
    }

    // check that all references to paints, tools, and techniques are valid before proceeding
    try {
      // check if the paint exists
      const _paint = await this.prisma.paint.findUniqueOrThrow({
        where: {
          id: createRecipeStepDto.paintId,
        },
      });
      // check if the technique exists
      const _technique = await this.prisma.technique.findUniqueOrThrow({
        where: {
          id: createRecipeStepDto.techniqueId,
        },
      });
      // check if the tool exists
      const _tool = await this.prisma.tool.findUniqueOrThrow({
        where: {
          id: createRecipeStepDto.toolId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.NotFoundError) {
        throw new NotFoundException("paint, tool, and technique must exist");
      } else {
        throw new InternalServerErrorException();
      }
    }

    try {
      // all references to existing objects are validated, create the recipe step
      const recipeStep: RecipeStep = await this.prisma.recipeStep.create({
        data: {
          recipeId,
          techniqueId: createRecipeStepDto.techniqueId,
          paintId: createRecipeStepDto.paintId,
          toolId: createRecipeStepDto.toolId,
          instruction: createRecipeStepDto.instruction,
        },
      });
      return recipeStep;
    } catch (err) {
      console.log({ err });
      throw new InternalServerErrorException();
    }
  }

  async findAllStepsFromRecipe(recipeId: number): Promise<RecipeStep[]> {
    const allSteps = await this.prisma.recipeStep.findMany({
      where: {
        recipeId: recipeId,
      },
    });
    return allSteps;
  }

  // TODO: consider implementing updates on existing recipe steps
  // update(id: number, updateRecipeStepDto: UpdateRecipeStepDto) {
  //   return `This action updates a #${id} recipeStep`;
  // }

  async remove(id: number) {
    try {
      const removedStep = this.prisma.recipeStep.delete({
        where: {
          id,
        },
      });
      return removedStep;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException("No post exists to delete with id");
      } else {
        throw new InternalServerErrorException(
          "unknown error while deleting recipe step"
        );
      }
    }
  }
}
