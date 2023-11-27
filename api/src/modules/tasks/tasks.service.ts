import { PrismaService } from 'src/db/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CurrentUserRequest } from 'src/auth/security/current-user.decorator';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException
} from '@nestjs/common';
import { ProjectsValidationService } from '../projects/projects.validation.service';
import { TagsValidationService } from '../tags/tags.validation.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ResponseListTasksDto } from './dtos/response-list-tasks.docs';
import { TasksMapper } from './tasks.mapper.service';
import { ResponseTaskDto } from './dtos/response-task.docs';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectValidation: ProjectsValidationService,
    private readonly tagValidation: TagsValidationService,
    private readonly tasksMapper: TasksMapper
  ) {}

  async create(
    projectId: number,
    createTaskDto: CreateTaskDto,
    currentUserRequest: CurrentUserRequest
  ) {
    Logger.log('TasksService/create');
    await this.projectValidation.validationProjectExists(projectId);

    await this.projectValidation.validateUserInProject(
      currentUserRequest.sub,
      projectId
    );

    await this.tagValidation.validationTagExists(createTaskDto.tagIds);
    const { title, description, status } = createTaskDto;

    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          projectId: +projectId,
          status,
          TagsTask: {
            create: createTaskDto.tagIds.map((tagId) => {
              return {
                tag: { connect: { id: tagId } }
              };
            })
          }
        }
      });

      return task;
    } catch (error) {
      Logger.error('Error - TasksService/create ', JSON.stringify({ error }));
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }

  async update(
    projectId: number,
    createTaskDto: CreateTaskDto,
    currentUserRequest: CurrentUserRequest,
    taskId: number
  ): Promise<ResponseTaskDto> {
    Logger.log('TasksService/update');
    await this.projectValidation.validationProjectExists(projectId);

    await this.projectValidation.validateUserInProject(
      currentUserRequest.sub,
      projectId
    );
    await this.tagValidation.validationTagExists(createTaskDto.tagIds);

    const { title, description, status } = createTaskDto;

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId
        }
      });
      if (task.status === 'CONCLUIDA') {
        throw new UnprocessableEntityException(
          'A tarefa já foi concluida e não pode mais ser modificada'
        );
      }
      const taskUpdated = await this.prisma.task.update({
        where: {
          id: taskId
        },
        data: {
          title,
          description,
          projectId: +projectId,
          status
        }
      });

      return this.tasksMapper.toResponse(taskUpdated);
    } catch (error) {
      Logger.error('Error - TasksService/update ', JSON.stringify({ error }));
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }

  async findAll(
    projectId: number,
    paginationDto: PaginationDto
  ): Promise<ResponseListTasksDto> {
    const { limit, page } = paginationDto;
    const itemsPerPage = limit || 10;
    const currentPage = page || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    const totalItems = await this.prisma.task.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const data = await this.prisma.task.findMany({
      skip,
      take: itemsPerPage,
      where: {
        projectId: +projectId
      },
      include: {
        TagsTask: true
      }
    });

    const tags = await this.prisma.tag.findMany();

    const filterTagsToTasks = data.map((task) => {
      const taskWithTags: any = {
        ...task,
        tags: task.TagsTask.map((tagsTask) =>
          tags.find((tag) => {
            if (tag.id === tagsTask.tagId) {
              return tag.title;
            }
          })
        )
      };
      return taskWithTags;
    });

    const tasksWithTags = filterTagsToTasks.map((task) => {
      delete task.TagsTask;
      return {
        ...task,
        tags: task.tags.length > 0 ? task.tags.map((task) => task.title) : []
      };
    });

    return {
      tasks: tasksWithTags,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
      totalItems
    };
  }
}
