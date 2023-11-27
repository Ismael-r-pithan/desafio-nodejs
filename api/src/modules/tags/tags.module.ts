import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsMapper } from './tags.mapper.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, TagsMapper, PrismaService]
})
export class TagsModule {}
