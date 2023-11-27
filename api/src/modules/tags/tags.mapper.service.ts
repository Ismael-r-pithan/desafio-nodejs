import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { ResponseTagDto } from './dto/response-tag.dto';

@Injectable()
export class TagsMapper {
  toResponse(entity: Tag): ResponseTagDto {
    const response: ResponseTagDto = {
      id: entity.id,
      title: entity.title
    };
    return response;
  }
}
