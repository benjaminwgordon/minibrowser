import { Test, TestingModule } from "@nestjs/testing";
import { PostTagController } from "./post-tag.controller";
import { PostTagService } from "./post-tag.service";
import { PrismaService } from "../prisma/prisma.service";

describe("PostTagController", () => {
  let controller: PostTagController;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostTagController],
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

    controller = module.get<PostTagController>(PostTagController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
