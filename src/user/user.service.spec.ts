import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";

describe("UserService", () => {
  let service: UserService;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
