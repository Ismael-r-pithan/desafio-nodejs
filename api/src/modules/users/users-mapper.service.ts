import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersMapper {
  toResponse(entity: User): ResponseUserDto {
    const response: ResponseUserDto = {
      id: entity.id,
      name: entity.name,
      email: entity.email
    };
    return response;
  }
}
