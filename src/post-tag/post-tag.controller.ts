import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag.dto';

@Controller('post/:postId/tag')
export class PostTagController {
  constructor(private readonly postTagService: PostTagService) {}

  @Post()
  createMany(
    @Param('postId') postId,
    @Body() createPostTagDto: CreatePostTagDto,
  ) {
    return this.postTagService.createMany(postId, createPostTagDto);
  }

  @Get()
  findAll() {
    return this.postTagService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTagService.remove(+id);
  }
}
