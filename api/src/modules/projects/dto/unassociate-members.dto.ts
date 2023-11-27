import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class UnassociateMembersDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  membersIds: number[];
}
