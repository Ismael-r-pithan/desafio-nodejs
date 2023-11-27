import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dtos/create-auth.dto';
import { PrismaService } from 'src/db/prisma.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ResponseAuthDocs } from './dtos/response-auth.dto';
import { UsersMapper } from '@/modules/users/users-mapper.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    private readonly userMapper: UsersMapper
  ) {}

  async create(createAuthSchema: CreateAuthDto): Promise<ResponseAuthDocs> {
    Logger.log('AuthService/create');
    const { email, password } = createAuthSchema;

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou Senha incorretos.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou Senha incorretos.');
    }

    const token = this.jwt.sign({ sub: user.id });

    return {
      token,
      user: this.userMapper.toResponse(user)
    };
  }
}
