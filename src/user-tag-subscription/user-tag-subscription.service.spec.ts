import { Test, TestingModule } from "@nestjs/testing";
import { UserTagSubscriptionService } from "./user-tag-subscription.service";
import { PrismaService } from "../prisma/prisma.service";

describe("UserTagSubscriptionService", () => {
  let service: UserTagSubscriptionService;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTagSubscriptionService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    service = module.get<UserTagSubscriptionService>(
      UserTagSubscriptionService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
