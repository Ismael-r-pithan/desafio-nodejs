import { Status } from '@prisma/client';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  @ApiProperty()
  status: Status;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];
}
