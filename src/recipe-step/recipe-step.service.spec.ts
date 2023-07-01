import { Test, TestingModule } from "@nestjs/testing";
import { RecipeStepService } from "./recipe-step.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundError } from "@prisma/client/runtime";
import {
  Paint,
  Recipe,
  RecipeStep,
  Technique,
  Tool,
  User,
} from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

describe("RecipeStepService", () => {
  let service: RecipeStepService;

  const mockDB = {
    recipe: {
      findUnique: jest.fn((args: { where: { id: number } }) => {
        // simulate searching for a recipe that doesnt exist
        if (args.where.id === -1) {
          return null;
        }
        // simulate searching for a recipe that doesn't belong to the user
        else if (args.where.id === -2) {
          const mockPaint: Recipe | { post: { authorId: number } } = {
            id: 1,
            postId: 1,
            recipeFor: "Pauldron",
            post: {
              authorId: -1,
            },
          };
          return mockPaint;
        }
        // simulate successful recipe find that belongs to the user
        else {
          const mockPaint: Recipe | { post: { authorId: number } } = {
            id: 1,
            postId: 1,
            recipeFor: "Pauldron",
            post: {
              authorId: 7,
            },
          };
          return mockPaint;
        }
      }),
    },
    recipeStep: {
      create: jest.fn(
        (args: {
          data: {
            recipeId: number;
            techniqueId: number;
            paintId: number;
            toolId: number;
            instruction: string;
          };
        }) => {
          // TODO: should I simulate all the cases where I fail to find recipe, paint, tool, or technique?
          const { recipeId, techniqueId, paintId, toolId, instruction } =
            args.data;
          const mockRecipeStep: RecipeStep = {
            id: 1,
            recipeId,
            instruction,
            techniqueId,
            paintId,
            toolId,
          };
          return mockRecipeStep;
        }
      ),
    },
    paint: {
      findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
        // simulate searching for a paint that doesnt exist
        if (args.where.id === -1) {
          throw new NotFoundError("no paint exists with this id");
        } else {
          const mockPaint: Paint = {
            id: 1,
            name: "Abaddon Black",
            hexColor: "#ffffff",
          };
          return mockPaint;
        }
      }),
    },
    tool: {
      findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
        // simulate searching for a tool that doesnt exist
        if (args.where.id === -1) {
          throw new NotFoundError("no tool exists with this id");
        } else {
          const mockTool: Tool = {
            id: 1,
            name: "Dry Brush",
            iconSVG: "{{Mock SVG Raw Text}}",
          };
          return mockTool;
        }
      }),
    },
    technique: {
      findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
        // simulate searching for a technique that doesnt exist
        if (args.where.id === -1) {
          throw new NotFoundError("no technique exists with this id");
        } else {
          const mockTechnique: Technique = {
            id: 1,
            name: "Edge Highlight",
            iconSVG: "{{Mock SVG Raw Text}}",
          };
          return mockTechnique;
        }
      }),
    },
  };

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

  describe("POST NEW", () => {
    it("should throw a 404 if the user attemps to upload steps for a post that doesnt exist", async () => {
      await expect(
        service.create(
          {
            id: 7,
            email: "testyMcTestFace@test.com",
            username: "testyMcTestFace",
            hash: "testHash",
          },
          -1,
          {
            paintId: 3,
            toolId: 9,
            techniqueId: 6,
            instruction: "mock instructions",
          }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw a forbidden exception if the user doesn't own the post they are adding steps to", async () => {
      await expect(
        service.create(
          {
            id: 7,
            email: "testyMcTestFace@test.com",
            username: "testyMcTestFace",
            hash: "testHash",
          },
          // this post id of -2 belongs to the user with id -1, thus doesnt belong to testyMcTestFace
          -2,
          {
            paintId: 3,
            toolId: 9,
            techniqueId: 6,
            instruction: "mock instructions",
          }
        )
      ).rejects.toThrow(ForbiddenException);
    });

    it("should return a recipe as an array of recipe steps", async () => {
      await expect(
        service.create(
          {
            id: 7,
            email: "testyMcTestFace@test.com",
            username: "testyMcTestFace",
            hash: "testHash",
          },
          5,
          {
            paintId: 3,
            toolId: 9,
            techniqueId: 6,
            instruction: "mock instructions",
          }
        )
      ).resolves.toStrictEqual({
        id: 1,
        paintId: 3,
        toolId: 9,
        techniqueId: 6,
        recipeId: 5,
        instruction: "mock instructions",
      });
    });
  });
});
