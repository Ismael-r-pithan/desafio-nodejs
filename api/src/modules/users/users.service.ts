import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { hash } from 'bcryptjs';
import { UsersMapper } from './users-mapper.service';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersMapper: UsersMapper
  ) {}
  async create(createUserSchema: CreateUserDto): Promise<ResponseUserDto> {
    Logger.log('UsersService/create');
    const { name, email, password } = createUserSchema;

    try {
      const userAlreadyExists = await this.prisma.user.findUnique({
        where: {
          email
        }
      });

      if (userAlreadyExists) {
        throw new ConflictException('Usuário já cadastrado no sistema');
      }

      const hashedPassword = await hash(password, 8);
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
        }
      });

      return this.usersMapper.toResponse(user);
    } catch (error) {
      if (error instanceof ConflictException) throw error;

      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde'
      );
    }
  }
}
