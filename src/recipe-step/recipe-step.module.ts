import { Module } from '@nestjs/common';
import { RecipeStepService } from './recipe-step.service';
import { RecipeStepController } from './recipe-step.controller';

@Module({
  controllers: [RecipeStepController],
  providers: [RecipeStepService]
})
export class RecipeStepModule {}
