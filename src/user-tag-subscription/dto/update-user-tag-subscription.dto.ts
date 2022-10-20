import { PartialType } from '@nestjs/mapped-types';
import { CreateUserTagSubscriptionDto } from './create-user-tag-subscription.dto';

export class UpdateUserTagSubscriptionDto extends PartialType(CreateUserTagSubscriptionDto) {}
