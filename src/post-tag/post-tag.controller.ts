import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { CreatePostTagDto } from './dto/create-post-tag.dto';
import { UpdatePostTagDto } from './dto/update-post-tag.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
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

  // find all tags associated with post
  @Get()
  findAll(@Param('postId', ParseIntPipe) postId: number) {
    return this.postTagService.findAll(postId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postTagService.remove(+id);
  }
}
