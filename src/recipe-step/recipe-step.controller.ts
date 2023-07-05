import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { RecipeStepService } from "./recipe-step.service";
import RecipeStepDto from "./dto/create-recipe-steps.dto";
import { User } from "@prisma/client";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { GetUser } from "../auth/decorator";

@UseGuards(JwtGuard)
@Controller("recipe/:recipeId/recipe-step")
export class RecipeStepController {
  constructor(private readonly recipeStepService: RecipeStepService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Param("recipeId", ParseIntPipe) recipeId: number,
    @Body() createRecipeStepDto: RecipeStepDto
  ) {
    return this.recipeStepService.create(user, recipeId, createRecipeStepDto);
  }

  @Get()
  findAll(@Param("recipeId", ParseIntPipe) recipeId: number) {
    return this.recipeStepService.findAllStepsFromRecipe(recipeId);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recipeStepService.remove(+id);
  }
}
