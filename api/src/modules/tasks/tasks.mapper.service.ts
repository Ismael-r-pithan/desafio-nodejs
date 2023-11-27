import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { ResponseTaskDto } from './dtos/response-task.docs';

@Injectable()
export class TasksMapper {
  toResponse(entity: Task): ResponseTaskDto {
    const response: ResponseTaskDto = {
      id: entity.id,
      description: entity.description,
      status: entity.status,
      title: entity.title
    };
    return response;
  }
}
