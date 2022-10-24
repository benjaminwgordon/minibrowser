import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeWithStepsDto } from './dto/create-recipe.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('/post/:postId/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createRecipeWithStepsDto: CreateRecipeWithStepsDto,
  ) {
    return this.recipeService.create(postId, createRecipeWithStepsDto);
  }

  @Get()
  findAll(@Param('postId', ParseIntPipe) postId: number) {
    return this.recipeService.findAll(postId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.recipeService.findOne(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recipeService.remove(+id);
  // }
}
