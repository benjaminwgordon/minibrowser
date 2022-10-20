import { Test, TestingModule } from '@nestjs/testing';
import { RecipeStepService } from './recipe-step.service';

describe('RecipeStepService', () => {
  let service: RecipeStepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeStepService],
    }).compile();

    service = module.get<RecipeStepService>(RecipeStepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
