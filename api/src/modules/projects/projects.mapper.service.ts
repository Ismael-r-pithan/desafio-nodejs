import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { ResponseProjectDto } from './dto/response-project.dto';

@Injectable()
export class ProjectsMapper {
  toResponse(entity: Project): ResponseProjectDto {
    const response: ResponseProjectDto = {
      id: entity.id,
      description: entity.description,
      name: entity.name
    };
    return response;
  }
}
