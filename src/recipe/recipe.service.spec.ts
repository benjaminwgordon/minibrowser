import { Test, TestingModule } from "@nestjs/testing";
import { RecipeService } from "./recipe.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundError } from "@prisma/client/runtime";
import { Recipe } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";

describe("RecipeService", () => {
  let service: RecipeService;

  const mockDB = {
    recipe: {
      create: jest.fn(
        (args: {
          data: {
            post: {
              connect: { id: number };
            };
            recipeFor: string;
          };
        }) => {
          // simulate creating a recipe for a post that doesn't exist
          if (args.data.post.connect.id === -1) {
            throw new NotFoundError("no post exists with id");
          } else {
            const recipe: Recipe = {
              id: 1,
              postId: 5,
              recipeFor: args.data.recipeFor,
            };
            return recipe;
          }
        }
      ),
    },
  };

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

  describe("POST NEW", () => {
    it("Should throw a 404 if the target post ID does not exist", async () => {
      await expect(
        service.create(
          // postId -1 does not exist, db will fail to find
          -1,
          {
            recipeFor: "Pauldron",
          }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it("should return a Recipe with no steps", async () => {
      await expect(
        service.create(
          // postId -1 does not exist, db will fail to find
          1,
          {
            recipeFor: "Pauldron",
          }
        )
      ).resolves.toStrictEqual({
        id: 1,
        postId: 5,
        recipeFor: "Pauldron",
      });
    });
  });
});
