import { Test, TestingModule } from '@nestjs/testing';
import { RecipeStepController } from './recipe-step.controller';
import { RecipeStepService } from './recipe-step.service';

describe('RecipeStepController', () => {
  let controller: RecipeStepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeStepController],
      providers: [RecipeStepService],
    }).compile();

    controller = module.get<RecipeStepController>(RecipeStepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
