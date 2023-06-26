import { Test, TestingModule } from "@nestjs/testing";
import { RecipeStepService } from "./recipe-step.service";
import { PrismaService } from "../prisma/prisma.service";

describe("RecipeStepService", () => {
  let service: RecipeStepService;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeStepService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<RecipeStepService>(RecipeStepService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
