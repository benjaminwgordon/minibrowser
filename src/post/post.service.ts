import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import IPublicUserInfo from 'src/user/types/publicUser';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, dto: CreatePostDto): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        author: {
          connect: {
            id: user.id,
          },
        },
        content: dto.content,
        description: dto.description,
      },
    });
    return post;
  }

  async findAll(): Promise<
    (Post & { author: { username: string; id: number } })[]
  > {
    const posts = await this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        description: true,
        authorId: true,
        author: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });
    return posts;
  }

  async findOne(id: number) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return post;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('no posts exist with id');
      }
    }
  }

  // // update(id: number, updatePostDto: UpdatePostDto) {
  // //   return `This action updates a #${id} post`;
  // // }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
