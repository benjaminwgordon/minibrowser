import { Test, TestingModule } from "@nestjs/testing";
import { UserTagSubscriptionController } from "./user-tag-subscription.controller";
import { UserTagSubscriptionService } from "./user-tag-subscription.service";
import { PrismaService } from "../prisma/prisma.service";

describe("UserTagSubscriptionController", () => {
  let controller: UserTagSubscriptionController;

  const mockDB = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTagSubscriptionController],
      providers: [
        UserTagSubscriptionService,
        {
          provide: PrismaService,
          useValue: mockDB,
        },
      ],
    }).compile();

    controller = module.get<UserTagSubscriptionController>(
      UserTagSubscriptionController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
