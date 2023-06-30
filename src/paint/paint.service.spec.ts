import { Test, TestingModule } from "@nestjs/testing";
import { PaintService } from "./paint.service";
import { Paint } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundError } from "@prisma/client/runtime";
import { NotFoundException } from "@nestjs/common";

describe("PaintService", () => {
  let service: PaintService;

  let mockDB = {
    paint: {
      findMany: jest.fn(() => {
        const paintList: Paint[] = [
          { id: 1, name: "Abaddon Black", hexColor: "#ffffff" },
          { id: 2, name: "Fenrisian Gray", hexColor: "#aaaaaa" },
          { id: 3, name: "Thunderhawk Blue", hexColor: "#aa88ff" },
        ];
        return paintList;
      }),
      findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
        const paint = { id: 1, name: "Abaddon Black", hexColor: "#ffffff" };

        // simulate fail to find error
        if (args.where.id === -1) {
          throw new NotFoundError(
            `failed to find paint with id: ${args.where.id}`
          );
        } else {
          return paint;
        }
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaintService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<PaintService>(PaintService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("GET ALL", () => {
    it("should return a list of paint objects", async () => {
      expect(await service.findAll()).toStrictEqual([
        { id: 1, name: "Abaddon Black", hexColor: "#ffffff" },
        { id: 2, name: "Fenrisian Gray", hexColor: "#aaaaaa" },
        { id: 3, name: "Thunderhawk Blue", hexColor: "#aa88ff" },
      ]);
    });

    it("should never throw an error code", async () => {
      expect(await service.findAll()).toStrictEqual([
        { id: 1, name: "Abaddon Black", hexColor: "#ffffff" },
        { id: 2, name: "Fenrisian Gray", hexColor: "#aaaaaa" },
        { id: 3, name: "Thunderhawk Blue", hexColor: "#aa88ff" },
      ]);
    });
  });

  describe("GET ONE", () => {
    it("should return a single paint object", async () => {
      expect(await service.findOne(1)).toStrictEqual({
        id: 1,
        name: "Abaddon Black",
        hexColor: "#ffffff",
      });
    });

    it("should throw a 404 if no paint exists with specified id", async () => {
      await expect(service.findOne(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
