import { Post, Tag } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreatePostTagDto {
  post: Post;
  tags: Tag[];
}
