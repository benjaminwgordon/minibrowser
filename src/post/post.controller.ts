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
  ParseIntPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/createPost.dto";
import { User } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtGuard } from "../auth/guard/jwt.guard";
import { GetUser } from "../auth/decorator";

@Controller("post")
@UseGuards(JwtGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  create(
    @GetUser() user: User,
    @UploadedFile() file: any,
    @Body() createPostDto: CreatePostDto
  ) {
    return this.postService.create(user, createPostDto, file);
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Query("tagId") tagId,
    @Query("subscribedTags") subscribedTags,
    @Query("cursor", new ParseIntPipe()) cursor,
    @Query("take", new ParseIntPipe()) take
  ) {
    console.log({ cursor });
    if (tagId) {
      console.log({ tagId });
      console.log({ subscribedTags });
      console.log("fetching one post by id");
      return this.postService.findAllByTag(tagId, cursor);
    } else if (subscribedTags) {
      console.log("fetching all posts by subscribed tags");
      return this.postService.findAllBySubscribedTags(user, cursor);
    } else {
      console.log("fetching all posts");
      return this.postService.findAll(cursor, take);
    }
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postService.findOne(+id);
  }
}
