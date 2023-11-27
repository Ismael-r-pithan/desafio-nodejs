import { ApiProperty } from '@nestjs/swagger';

export class ResponseAssociateMembersDto {
  @ApiProperty()
  message: string;
}
