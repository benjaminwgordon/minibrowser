import { Injectable } from '@nestjs/common';
import { Recipe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    console.log({ createRecipeDto });
    const postId = parseInt(createRecipeDto.postId);
    const newRecipe = await this.prisma.recipe.create({
      data: {
        postId: postId,
      },
    });
    return newRecipe;
  }

  // findAll() {
  //   return `This action returns all recipe`;
  // }

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
