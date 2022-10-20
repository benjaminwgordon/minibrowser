import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma, Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  create(createTagDto: CreateTagDto) {
    try {
      const tag = this.prisma.tag.create({
        data: {
          name: createTagDto.name,
        },
      });
      return tag;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // uniqueness constraint failed
        if (err.code === 'P2002') {
          throw new ForbiddenException('This tag already exists');
        }
      }
    }
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TagWhereUniqueInput;
    where?: Prisma.TagWhereInput;
    orderBy?: Prisma.TagOrderByWithAggregationInput;
    select?: Prisma.TagSelect;
  }): Promise<Tag[]> {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.tag.findMany(params);
  }

  /**
   *
   * @param take number of tags to return
   * @returns
   */
  async maxTagsByPostCount(take?: number): Promise<Tag[]> {
    // TODO: relational queries inside groupBy statements seem to not be possible, resulting in a  two step query.  Revisit at a later date to identify single-query methods to get same behavior
    const maxTagsOnPostsByPostCount = await this.prisma.tagsOnPosts.groupBy({
      by: ['tagId'],
      _count: {
        postId: true,
      },
      orderBy: {
        _count: {
          postId: 'desc',
        },
      },
      take: take ? take : 10,
    });

    const ids = maxTagsOnPostsByPostCount.map((postTag) => postTag.tagId);

    const maxTagsByPostCount = this.prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return maxTagsByPostCount;
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
