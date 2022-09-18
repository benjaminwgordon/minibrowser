import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import IPublicUserInfo from 'src/user/types/publicUser';
import AWS from 'aws-sdk';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: User,
    dto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    // first, try to upload file to s3, if this fails do not create the associated entry in the database
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    });

    const uploadedImage = await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
      })
      .promise();

    console.log({ uploadedImage });

    // if the image upload to s3 succeeds, create the post in the db

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
