import { Injectable } from '@nestjs/common';
import { User, Prisma, Post } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import IPublicUserInfo from './types/publicUser';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput;
    select?: Prisma.UserSelect;
  }): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<IPublicUserInfo | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        username: true,
      },
    });
  }

  async findOneWithPosts(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<IPublicUserInfo & { posts: Post[] }> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        username: true,
        posts: {
          select: {
            title: true,
            content: true,
            authorId: true,
            author: {
              select: {
                username: true,
                id: true,
              },
            },
            id: true,
            description: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
