import { ApiProperty } from '@nestjs/swagger';

export class ResponseTagDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
}
