import { ApiProperty } from '@nestjs/swagger';

export class ResponseUnassociateMembersDto {
  @ApiProperty()
  message: string;
}
