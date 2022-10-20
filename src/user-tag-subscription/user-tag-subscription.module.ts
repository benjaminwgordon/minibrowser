import { Module } from '@nestjs/common';
import { UserTagSubscriptionService } from './user-tag-subscription.service';
import { UserTagSubscriptionController } from './user-tag-subscription.controller';

@Module({
  controllers: [UserTagSubscriptionController],
  providers: [UserTagSubscriptionService]
})
export class UserTagSubscriptionModule {}
