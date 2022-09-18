import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User, Post as IPost } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import IPublicUserInfo from './types/publicUser';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('delete')
  async delete(@Body() userData: { username: string }) {
    return this.userService.deleteUser(userData);
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('search')
  async findOneByUsernameSearch(
    @Query() queryParams: { username: string },
  ): Promise<IPublicUserInfo[]> {
    return await this.userService.findMany({
      select: { id: true, username: true },
      where: { username: { contains: queryParams.username } },
    });
  }

  @Get(':id')
  async findOne(@Param() params): Promise<IPublicUserInfo> {
    return await this.userService.findOne({ id: parseInt(params.id) });
  }

  @Get(':username/posts')
  async findOneWithPosts(
    @Param() params,
  ): Promise<IPublicUserInfo & { posts: IPost[] }> {
    console.log({ params });
    return await this.userService.findOneWithPosts({
      username: params.username,
    });
  }
}
