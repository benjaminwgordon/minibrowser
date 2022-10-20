import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
@UseGuards(JwtGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(user, createPostDto, file);
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Query('tagId') tagId,
    @Query('subscribedTags') subscribedTags,
  ) {
    if (tagId) {
      console.log({ tagId });
      console.log({ subscribedTags });
      console.log('fetching one post by id');
      return this.postService.findAllByTag(tagId);
    } else if (subscribedTags) {
      console.log('fetching all posts by subscribed tags');
      return this.postService.findAllBySubscribedTags(user);
    } else {
      console.log('fetching all posts');
      return this.postService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
