import { Test, TestingModule } from "@nestjs/testing";
import { TechniqueService } from "./technique.service";
import { Technique } from "@prisma/client";
import { NotFoundError } from "@prisma/client/runtime";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("TechniqueService", () => {
  let service: TechniqueService;

  let mockDB = {
    technique: {
      findMany: jest.fn(() => {
        const techniqueList: Technique[] = [
          {
            id: 1,
            name: "Dry Brush",
            iconSVG: "{{Dummy Icon SVG Raw Text}}",
          },
          {
            id: 2,
            name: "Base",
            iconSVG: "{{Dummy Icon SVG Raw Text}}",
          },
          {
            id: 3,
            name: "Layer",
            iconSVG: "{{Dummy Icon SVG Raw Text}}",
          },
        ];
        return techniqueList;
      }),
      findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
        const technique = {
          id: 2,
          name: "Base",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        };

        // simulate fail to find error
        if (args.where.id === -1) {
          throw new NotFoundError(
            `failed to find technique with id: ${args.where.id}`
          );
        } else {
          return technique;
        }
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechniqueService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<TechniqueService>(TechniqueService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("GET ALL", () => {
    it("should return a list of technique objects", async () => {
      expect(await service.findAll()).toStrictEqual([
        {
          id: 1,
          name: "Dry Brush",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        },
        {
          id: 2,
          name: "Base",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        },
        {
          id: 3,
          name: "Layer",
          iconSVG: "{{Dummy Icon SVG Raw Text}}",
        },
      ]);
    });
  });

  describe("GET ONE", () => {
    it("should return a single technique object", async () => {
      expect(await service.findOne(2)).toStrictEqual({
        id: 2,
        name: "Base",
        iconSVG: "{{Dummy Icon SVG Raw Text}}",
      });
    });

    it("should throw a 404 if no technique exists with specified id", async () => {
      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
