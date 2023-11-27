import { ApiProperty } from '@nestjs/swagger';

export class ResponseProjectDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
