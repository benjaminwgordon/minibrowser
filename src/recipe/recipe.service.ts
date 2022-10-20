import { Injectable } from '@nestjs/common';
import { Recipe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(
    postId: number,
    createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    console.log({ createRecipeDto });
    const newRecipe = await this.prisma.recipe.create({
      data: {
        postId,
      },
    });
    return newRecipe;
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
