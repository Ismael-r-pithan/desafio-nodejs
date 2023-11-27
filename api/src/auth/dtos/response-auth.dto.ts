import { ResponseUserDto } from '@/modules/users/dto/response-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDocs {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: ResponseUserDto;
}
