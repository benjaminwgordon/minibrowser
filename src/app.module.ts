import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { PostTagModule } from './post-tag/post-tag.module';
import { UserTagSubscriptionModule } from './user-tag-subscription/user-tag-subscription.module';
import { RecipeModule } from './recipe/recipe.module';
import { RecipeStepModule } from './recipe-step/recipe-step.module';
import { Express } from 'express';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    TagModule,
    PostTagModule,
    UserTagSubscriptionModule,
    RecipeModule,
    RecipeStepModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
