import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/db/prisma.service';
import { UsersMapper } from './users-mapper.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersMapper]
})
export class UsersModule {}
