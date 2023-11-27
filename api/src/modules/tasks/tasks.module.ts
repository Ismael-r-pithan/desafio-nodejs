import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { TasksService } from './tasks.service';
import { ProjectsValidationService } from '../projects/projects.validation.service';
import { TagsValidationService } from '../tags/tags.validation.service';
import { TasksMapper } from './tasks.mapper.service';

@Module({
  controllers: [],
  providers: [
    PrismaService,
    TasksService,
    ProjectsValidationService,
    TagsValidationService,
    TasksMapper
  ]
})
export class TaskModule {}
