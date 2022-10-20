import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Tag, User, UserTagSubscriptions } from '@prisma/client';
import { CreateUserTagSubscriptionDto } from './dto/create-user-tag-subscription.dto';
import { UpdateUserTagSubscriptionDto } from './dto/update-user-tag-subscription.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { userInfo } from 'os';

@Injectable()
export class UserTagSubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: User,
    createUserTagSubscriptionDto: CreateUserTagSubscriptionDto,
  ): Promise<UserTagSubscriptions> {
    try {
      const newTagSub = await this.prisma.userTagSubscriptions.create({
        data: {
          userId: user.id,
          tagId: parseInt(createUserTagSubscriptionDto.tagId),
        },
      });
      return newTagSub;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log({ code: error.code });
        // foreign key constraint failed
        if (error.code === 'P2003') {
          throw new NotFoundException('Tag does not exist');
        }
        // unknown server error
        else {
          throw new InternalServerErrorException('unknown server error');
        }
      } else {
        console.log('Not a prisma known error');
      }
    }
  }

  async findAll(user: User): Promise<(UserTagSubscriptions & { tag: Tag })[]> {
    try {
      const userTagSubs = await this.prisma.userTagSubscriptions.findMany({
        where: {
          userId: user.id,
        },
        include: {
          tag: true,
        },
      });
      return userTagSubs;
    } catch (error) {}
  }

  findOne(id: number) {
    return `This action returns a #${id} userTagSubscription`;
  }

  update(
    id: number,
    updateUserTagSubscriptionDto: UpdateUserTagSubscriptionDto,
  ) {
    return `This action updates a #${id} userTagSubscription`;
  }

  async remove(user: User, tagId: number) {
    console.log({ user, tagId });
    const removedTagSubscription =
      await this.prisma.userTagSubscriptions.deleteMany({
        where: {
          userId: user.id,
          tagId: tagId,
        },
      });

    return removedTagSubscription;
  }
}
