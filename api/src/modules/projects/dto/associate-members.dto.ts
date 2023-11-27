import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class AssociateMembersDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  membersIds: number[];
}
