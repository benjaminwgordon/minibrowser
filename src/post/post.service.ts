import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import * as argon from 'argon2';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: User,
    dto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    // first, try to upload file to s3, if this fails do not create the associated entry in the database

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    });

    const uploadedImage = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: await argon.hash(user.username + file.originalname),
        Body: file.buffer,
      })
      .promise();

    console.log({ uploadedImage });

    if (uploadedImage && uploadedImage.Location) {
      // if the image upload to s3 succeeds, create the post in the db
      const post = await this.prisma.post.create({
        data: {
          title: dto.title,
          author: {
            connect: {
              id: user.id,
            },
          },
          content: uploadedImage.Location,
          description: dto.description,
        },
      });
      return post;
    } else {
      throw new Error('unable to upload image');
    }
  }

  // TODO: paginate for performance
  async findAll(
    tagId?: number,
  ): Promise<(Post & { author: { username: string; id: number } })[]> {
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
      orderBy: {
        id: 'desc',
      },
    });
    return posts;
  }

  async findAllByTag(
    tagId?: number,
  ): Promise<(Post & { author: { username: string; id: number } })[]> {
    if (typeof tagId === 'string') {
      tagId = parseInt(tagId);
    }
    const posts = await this.prisma.post.findMany({
      include: {
        TagsOnPosts: true,
        author: true,
      },
      where: {
        TagsOnPosts: {
          some: {
            tagId: tagId,
          },
        },
      },
    });
    return posts;
  }

  async findAllBySubscribedTags(
    user: User,
  ): Promise<(Post & { author: { username: string; id: number } })[]> {
    const userSubscribedTags = await this.prisma.userTagSubscriptions.findMany({
      where: {
        userId: user.id,
      },
      select: {
        tagId: true,
      },
    });

    const userSubscribedTagIds = userSubscribedTags.map((tag) => tag.tagId);

    const postsBySubscribedTags = this.prisma.post.findMany({
      where: {
        TagsOnPosts: {
          some: {
            tagId: {
              in: userSubscribedTagIds,
            },
          },
        },
      },
      include: {
        TagsOnPosts: true,
        author: true,
      },
    });

    return postsBySubscribedTags;
  }

  async findOne(id: number) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
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
