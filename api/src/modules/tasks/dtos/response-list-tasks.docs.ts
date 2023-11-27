import { ApiProperty } from '@nestjs/swagger';
import { ResponseTaskDto } from './response-task.docs';

export class ResponseListTasksDto {
  @ApiProperty({ type: [ResponseTaskDto] })
  tasks: ResponseTaskDto[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  totalItems: number;
}
