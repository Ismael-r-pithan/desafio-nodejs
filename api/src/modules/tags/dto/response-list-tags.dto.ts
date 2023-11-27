import { ApiProperty } from '@nestjs/swagger';
import { ResponseTagDto } from './response-tag.dto';

export class ResponseListTagsDto {
  @ApiProperty({ type: [ResponseTagDto] })
  tags: ResponseTagDto[];
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  totalItems: number;
}
