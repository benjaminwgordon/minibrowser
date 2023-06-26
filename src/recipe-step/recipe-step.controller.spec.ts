import { Test, TestingModule } from "@nestjs/testing";
import { RecipeStepController } from "./recipe-step.controller";
import { RecipeStepService } from "./recipe-step.service";
import { PrismaService } from "../prisma/prisma.service";

describe("RecipeStepController", () => {
  let controller: RecipeStepController;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeStepController],
      providers: [
        RecipeStepService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    controller = module.get<RecipeStepController>(RecipeStepController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
