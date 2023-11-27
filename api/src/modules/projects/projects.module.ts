import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/db/prisma.service';
import { TasksService } from '../tasks/tasks.service';
import { ProjectsValidationService } from './projects.validation.service';
import { TagsValidationService } from '../tags/tags.validation.service';
import { TasksMapper } from '../tasks/tasks.mapper.service';
import { ProjectsMapper } from './projects.mapper.service';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    PrismaService,
    TasksService,
    ProjectsValidationService,
    TagsValidationService,
    TasksMapper,
    ProjectsMapper
  ]
})
export class ProjectsModule {}
