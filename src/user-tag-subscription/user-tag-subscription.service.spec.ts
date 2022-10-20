import { Test, TestingModule } from '@nestjs/testing';
import { UserTagSubscriptionService } from './user-tag-subscription.service';

describe('UserTagSubscriptionService', () => {
  let service: UserTagSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTagSubscriptionService],
    }).compile();

    service = module.get<UserTagSubscriptionService>(UserTagSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
