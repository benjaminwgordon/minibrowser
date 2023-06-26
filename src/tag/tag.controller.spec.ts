import { Test, TestingModule } from "@nestjs/testing";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TagController", () => {
  let controller: TagController;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        TagService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
