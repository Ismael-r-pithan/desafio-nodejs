import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
@ApiBearerAuth('jwt-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Informações do usuário criado.',
    type: ResponseUserDto
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados informados para criação de usuário no formato incorreto.'
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já cadastrado.'
  })
  create(@Body() createUserSchema: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createUserSchema);
  }
}
