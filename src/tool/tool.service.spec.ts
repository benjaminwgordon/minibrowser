import { Test, TestingModule } from "@nestjs/testing";
import { ToolService } from "./tool.service";
import { Tool } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("ToolService", () => {
  let service: ToolService;

  let mockDB = {
    tool: {
      findMany: jest.fn(() => {
        const toolList: Tool[] = [
          {
            id: 1,
            name: "Standard Brush",
            iconSVG: "{{Dummy Icon SVG Raw Text}}",
          },
          {
            id: 2,
            name: "Fine Brush",
            iconSVG: "{{Dummy Icon SVG Raw Text}}",
          },
          {
            id: 3,
            name: "Dry Brush",
            iconSVG: "{{Dummy Icon SVG Raw Text}}",
          },
        ];
        return toolList;
      }),
      findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
        const tool = {
          id: 2,
          name: "Fine Brush",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        };

        // simulate fail to find error
        if (args.where.id === -1) {
          throw new NotFoundError(
            `failed to find tool with id: ${args.where.id}`
          );
        } else {
          return tool;
        }
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<ToolService>(ToolService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("GET ALL", () => {
    it("should return a list of tool objects", async () => {
      expect(await service.findAll()).toStrictEqual([
        {
          id: 1,
          name: "Standard Brush",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        },
        {
          id: 2,
          name: "Fine Brush",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        },
        {
          id: 3,
          name: "Dry Brush",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        },
      ]);
    });
  });

  describe("GET ONE", () => {
    it("should return a single tool object", async () => {
      expect(await service.findOne(2)).toStrictEqual({
        id: 2,
        name: "Fine Brush",
        iconSVG: "{{Dummy Icon SVG Raw Text}}",
      });
    });

    it("should throw a 404 if no tool exists with specified id", async () => {
      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
