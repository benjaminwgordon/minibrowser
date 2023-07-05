import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { Recipe } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRecipeWithoutStepsDTO } from "./dto/create-recipe.dto";
import { NotFoundError } from "@prisma/client/runtime";

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  // creates a new Recipe for a specific feature on a model
  // does not include any recipeSteps (they are added later)
  async create(
    postId: number,
    createRecipeWithoutStepsDto: CreateRecipeWithoutStepsDTO
  ): Promise<any> {
    try {
      const recipeWithoutSteps = await this.prisma.recipe.create({
        data: {
          post: {
            connect: { id: postId },
          },
          recipeFor: createRecipeWithoutStepsDto.recipeFor,
        },
      });
      return recipeWithoutSteps;
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundException(`No post exists with id ${postId}`);
      } else {
        console.log({ err });
        throw new InternalServerErrorException(
          "unknown error while creating recipe"
        );
      }
    }
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
