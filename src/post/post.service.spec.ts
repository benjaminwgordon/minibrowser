import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "./post.service";
import { PrismaService } from "../prisma/prisma.service";

describe("PostService", () => {
  let service: PostService;
  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            mockDB,
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
