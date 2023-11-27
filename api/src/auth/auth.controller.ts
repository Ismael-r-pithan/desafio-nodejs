import { Body, Controller, Post } from '@nestjs/common';
import { CreateAuthDto } from './dtos/create-auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAuthDocs } from './dtos/response-auth.dto';

@ApiTags('Auth')
@Controller({ path: 'sessions', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Token de acesso.',
    type: ResponseAuthDocs
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados informados para autenticação do usuário no formato incorreto.'
  })
  @ApiResponse({
    status: 401,
    description: 'E-mail ou senha incorretos.'
  })
  async create(@Body() createAuth: CreateAuthDto): Promise<ResponseAuthDocs> {
    return this.authService.create(createAuth);
  }
}
