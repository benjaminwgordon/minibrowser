import { Test, TestingModule } from "@nestjs/testing";
import { RecipeService } from "./recipe.service";
import { PrismaService } from "../prisma/prisma.service";

describe("RecipeService", () => {
  let service: RecipeService;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
