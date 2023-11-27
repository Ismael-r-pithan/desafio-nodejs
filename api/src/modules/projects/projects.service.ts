import {
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
  Logger
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/db/prisma.service';
import { CurrentUserRequest } from 'src/auth/security/current-user.decorator';
import { AssociateMembersDto } from './dto/associate-members.dto';
import { UnassociateMembersDto } from './dto/unassociate-members.dto';
import { ProjectsValidationService } from './projects.validation.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ProjectsMapper } from './projects.mapper.service';
import { ResponseListProjecsDto } from './dto/response-list-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectsValidation: ProjectsValidationService,
    private readonly projectMapper: ProjectsMapper
  ) {}
  async create(
    createProjectSchema: CreateProjectDto,
    currentUserRequest: CurrentUserRequest
  ) {
    Logger.log('ProjectsService/create');
    const { name, description } = createProjectSchema;

    try {
      const currentUser = await this.prisma.user.findUnique({
        where: {
          id: currentUserRequest.sub
        }
      });

      const project = await this.prisma.project.create({
        data: {
          name,
          description,
          creatorId: currentUser.id
        }
      });

      return project;
    } catch (error) {
      Logger.error(
        'Error - ProjectsService/create ',
        JSON.stringify({ error })
      );
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }

  async associateMembers(
    associateMembersDto: AssociateMembersDto,
    currentUser: CurrentUserRequest,
    id: number
  ) {
    Logger.log('ProjectsService/associateMembers');
    await this.projectsValidation.validateProjectCreator(id, currentUser.sub);
    await this.projectsValidation.validateUsersExistence(
      associateMembersDto.membersIds
    );

    const userProject = associateMembersDto.membersIds.map((userId) => {
      return {
        projectId: +id,
        userId: +userId
      };
    });
    try {
      await this.prisma.userProject.createMany({
        data: userProject,
        skipDuplicates: true
      });

      return {
        message: 'Adição realizada com sucesso'
      };
    } catch (error) {
      Logger.error(
        'Error - ProjectsService/associateMembers ',
        JSON.stringify({ error })
      );
      throw new ForbiddenException(
        'Somente o criador do projeto pode adicionar e remover membros.'
      );
    }
  }

  async unassociateMembers(
    unassociateMembersDto: UnassociateMembersDto,
    currentUser: CurrentUserRequest,
    id: number
  ) {
    Logger.log('ProjectsService/unassociateMembers');
    await this.projectsValidation.validateProjectCreator(id, currentUser.sub);

    const userProject = unassociateMembersDto.membersIds.map((userId) => {
      return {
        projectId: +id,
        userId: +userId
      };
    });

    try {
      await this.prisma.userProject.deleteMany({
        where: {
          OR: userProject
        }
      });

      return {
        message: 'Remoção realizada com sucesso'
      };
    } catch (error) {
      Logger.error(
        'Error - ProjectsService/unassociateMembers ',
        JSON.stringify({ error })
      );
      throw new ForbiddenException(
        'Somente o criador do projeto pode adicionar e remover membros.'
      );
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseListProjecsDto> {
    const { limit, page } = paginationDto;
    const itemsPerPage = limit || 10;
    const currentPage = page || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    const totalItems = await this.prisma.project.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const data = await this.prisma.project.findMany({
      skip,
      take: itemsPerPage
    });

    const projects = data.map((project) =>
      this.projectMapper.toResponse(project)
    );

    return {
      projects,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
      totalItems
    };
  }
}
