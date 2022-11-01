import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserTagSubscriptionService } from './user-tag-subscription.service';
import { CreateUserTagSubscriptionDto } from './dto/create-user-tag-subscription.dto';
import { UpdateUserTagSubscriptionDto } from './dto/update-user-tag-subscription.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('tags/subscribed')
export class UserTagSubscriptionController {
  constructor(
    private readonly userTagSubscriptionService: UserTagSubscriptionService,
  ) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body()
    createUserTagSubscriptionDto: CreateUserTagSubscriptionDto,
  ) {
    return this.userTagSubscriptionService.create(
      user,
      createUserTagSubscriptionDto,
    );
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.userTagSubscriptionService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTagSubscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserTagSubscriptionDto: UpdateUserTagSubscriptionDto,
  ) {
    return this.userTagSubscriptionService.update(
      +id,
      updateUserTagSubscriptionDto,
    );
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.userTagSubscriptionService.remove(user, id);
  }
}
