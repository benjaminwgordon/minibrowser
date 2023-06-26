import { Test, TestingModule } from "@nestjs/testing";
import { TagService } from "./tag.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TagService", () => {
  let service: TagService;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
