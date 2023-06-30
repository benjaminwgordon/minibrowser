import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PostModule } from "./post/post.module";
import { TagModule } from "./tag/tag.module";
import { PostTagModule } from "./post-tag/post-tag.module";
import { UserTagSubscriptionModule } from "./user-tag-subscription/user-tag-subscription.module";
import { RecipeModule } from "./recipe/recipe.module";
import { RecipeStepModule } from "./recipe-step/recipe-step.module";
import { LoggerMiddleware } from "./middleware/logger";
import { PaintModule } from './paint/paint.module';
import { ToolModule } from './tool/tool.module';

// conditionally load dev or prod environment variable files
const ENV = process.env.NODE_ENV;
console.log({ ENV });
const envPath = !ENV ? ".env" : `.env.${ENV}`;
console.log({ envPath });

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
    }),
    PostModule,
    TagModule,
    PostTagModule,
    UserTagSubscriptionModule,
    RecipeModule,
    RecipeStepModule,
    PaintModule,
    ToolModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
