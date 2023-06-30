import { Module } from '@nestjs/common';
import { PaintService } from './paint.service';
import { PaintController } from './paint.controller';

@Module({
  controllers: [PaintController],
  providers: [PaintService]
})
export class PaintModule {}
