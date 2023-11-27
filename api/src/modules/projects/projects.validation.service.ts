import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ProjectsValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateProjectCreator(
    projectId: number,
    cratorId: number
  ): Promise<void> {
    Logger.log('ProjectsValidationService/validateProjectCreator');
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id: +projectId
        }
      });

      if (project.creatorId !== cratorId) {
        throw new ForbiddenException();
      }
    } catch (error) {
      Logger.error(
        'Error - ProjectsValidationService/validateProjectCreator ',
        JSON.stringify({ error })
      );
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'Somente o criador do projeto pode adicionar e remover membros.'
        );
      }
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }

  async validateUsersExistence(userIds: number[]): Promise<void> {
    Logger.log('ProjectsValidationService/validateUsersExistence');
    try {
      const existingUsers = await this.prisma.user.findMany({
        where: {
          id: {
            in: userIds
          }
        }
      });

      const missingUserIds = userIds.filter((userId) => {
        return !existingUsers.some((user) => user.id === userId);
      });

      if (missingUserIds.length > 0) {
        throw new NotFoundException();
      }
    } catch (error) {
      Logger.error(
        'Error - ProjectsValidationService/validateUsersExistence ',
        JSON.stringify({ error })
      );
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }

  async validateUserInProject(
    userId: number,
    projectId: number
  ): Promise<void> {
    Logger.log('ProjectsValidationService/validateUserInProject');
    try {
      const userInProject = await this.prisma.userProject.findFirst({
        where: {
          AND: {
            projectId: +projectId,
            userId: +userId
          }
        }
      });

      const project = await this.prisma.project.findUnique({
        where: {
          id: +projectId
        }
      });

      if (!userInProject && project.creatorId != userId) {
        throw new ForbiddenException();
      }
    } catch (error) {
      Logger.error(
        'Error - ProjectsValidationService/validateUserInProject ',
        JSON.stringify({ error })
      );
      if (error instanceof ForbiddenException)
        throw new ForbiddenException(
          `O usuário com ID ${userId} não pertence ao projeto.`
        );
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }

  async validationProjectExists(projectId: number) {
    Logger.log('ProjectsValidationService/validationProjectExists');
    try {
      const project = await this.prisma.project.findUnique({
        where: {
          id: +projectId
        }
      });

      if (!project) {
        throw new NotFoundException();
      }
    } catch (error) {
      Logger.error(
        'Error - ProjectsValidationService/validationProjectExists ',
        JSON.stringify({ error })
      );
      if (error instanceof NotFoundException)
        throw new NotFoundException('Projeto não encontrado');
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }
}
