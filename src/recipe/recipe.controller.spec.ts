import { Test, TestingModule } from "@nestjs/testing";
import { RecipeController } from "./recipe.controller";
import { RecipeService } from "./recipe.service";
import { PrismaService } from "../prisma/prisma.service";

describe("RecipeController", () => {
  let controller: RecipeController;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        RecipeService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
