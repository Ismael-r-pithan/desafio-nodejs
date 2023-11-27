import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class ResponseTaskDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  status: Status;
}
