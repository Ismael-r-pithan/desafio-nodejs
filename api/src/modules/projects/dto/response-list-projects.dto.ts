import { ApiProperty } from '@nestjs/swagger';
import { ResponseProjectDto } from './response-project.dto';

export class ResponseListProjecsDto {
  @ApiProperty({ type: [ResponseProjectDto] })
  projects: ResponseProjectDto[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  totalItems: number;
}
