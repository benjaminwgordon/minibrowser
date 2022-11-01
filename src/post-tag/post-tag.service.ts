import { Injectable } from '@nestjs/common';
import { PrismaClient, Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag.dto';
import { PostTag } from './entities/post-tag.entity';

@Injectable()
export class PostTagService {
  constructor(private prisma: PrismaService) {}

  createMany(postId: number, createPostTagDto: CreatePostTagDto) {
    // receive an array of tags as arguments, convert to array of tagsOnPost[]
    const data = createPostTagDto.tags.map((tag) => ({
      postId: createPostTagDto.post.id,
      tagId: tag.id,
    }));

    const postWithTags = this.prisma.tagsOnPosts.createMany({
      data: data,
      skipDuplicates: true,
    });

    return postWithTags;
  }

  findAll(postId: number) {
    const tags = this.prisma.tagsOnPosts.findMany({
      where: {
        postId: postId,
      },
      include: {
        tag: true,
      },
    });
    return tags;
  }

  findOne(id: number) {
    return `This action returns a #${id} postTag`;
  }

  update(id: number, updatePostTagDto: UpdatePostTagDto) {
    return `This action updates a #${id} postTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} postTag`;
  }
}
