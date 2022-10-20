import { Test, TestingModule } from '@nestjs/testing';
import { UserTagSubscriptionController } from './user-tag-subscription.controller';
import { UserTagSubscriptionService } from './user-tag-subscription.service';

describe('UserTagSubscriptionController', () => {
  let controller: UserTagSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTagSubscriptionController],
      providers: [UserTagSubscriptionService],
    }).compile();

    controller = module.get<UserTagSubscriptionController>(UserTagSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
