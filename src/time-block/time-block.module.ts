import { Module } from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { TimeBlockController } from './time-block.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TimeBlockController],
  providers: [TimeBlockService, PrismaService],
  exports: [TimeBlockService]
})
export class TimeBlockModule {}
