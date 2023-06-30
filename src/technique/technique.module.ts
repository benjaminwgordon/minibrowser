import { Module } from '@nestjs/common';
import { TechniqueService } from './technique.service';
import { TechniqueController } from './technique.controller';

@Module({
  controllers: [TechniqueController],
  providers: [TechniqueService]
})
export class TechniqueModule {}
