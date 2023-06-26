import { Test, TestingModule } from "@nestjs/testing";
import { PostTagService } from "./post-tag.service";
import { PrismaService } from "../prisma/prisma.service";

describe("PostTagService", () => {
  let service: PostTagService;

  // TODO: db mocks for testing
  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostTagService,
        {
          provide: PrismaService,
          useValue: {
            mockDB,
          },
        },
      ],
    }).compile();

    service = module.get<PostTagService>(PostTagService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
