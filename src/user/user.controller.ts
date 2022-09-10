import { Controller, Get, Body, Param, UseGuards, Post } from '@nestjs/common';
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

  @Get(':id/posts')
  async findOneWithPosts(
    @Param() params,
  ): Promise<IPublicUserInfo & { posts: IPost[] }> {
    return await this.userService.findOneWithPosts({ id: parseInt(params.id) });
  }

  @Get(':id')
  async findOne(@Param() params): Promise<IPublicUserInfo> {
    return await this.userService.findOne({ id: parseInt(params.id) });
  }
}
