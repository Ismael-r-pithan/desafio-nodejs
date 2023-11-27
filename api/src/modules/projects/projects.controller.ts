import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  NotFoundException,
  Put,
  Query,
  Get
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  CurrentUser,
  CurrentUserRequest
} from 'src/auth/security/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/security/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssociateMembersDto } from './dto/associate-members.dto';
import { UnassociateMembersDto } from './dto/unassociate-members.dto';
import { CreateTaskDto } from '../tasks/dtos/create-task.dto';
import { TasksService } from '../tasks/tasks.service';
import { ResponseProjectDto } from './dto/response-project.dto';
import { ResponseTaskDto } from '../tasks/dtos/response-task.docs';
import { ResponseAssociateMembersDto } from './dto/response-associate-members.dto';
import { ResponseUnassociateMembersDto } from './dto/response-unassociate-members.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ResponseListProjecsDto } from './dto/response-list-projects.dto';
import { ResponseListTasksDto } from '../tasks/dtos/response-list-tasks.docs';

@ApiTags('Projects')
@Controller({ path: 'projects', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-token')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Informações do projeto criado.',
    type: ResponseProjectDto
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados informados para criação do projeto no formato incorreto.'
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado.'
  })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: CurrentUserRequest
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Post('/:id/tasks')
  @ApiResponse({
    status: 201,
    description: 'Informações da tarefa criada.',
    type: ResponseTaskDto
  })
  @ApiResponse({
    status: 400,
    description: 'Dados informados para criação da tarefa no formato incorreto.'
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado.'
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para criar tarefa nesse projeto.'
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.'
  })
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserRequest
  ) {
    if (Number.isNaN(+id)) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return this.tasksService.create(+id, createTaskDto, currentUser);
  }

  @Put('/:id/tasks/:task_id')
  @ApiResponse({
    status: 201,
    description: 'Informações da tarefa atualizada.',
    type: ResponseTaskDto
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados informados para atualização da tarefa no formato incorreto.'
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado.'
  })
  @ApiResponse({
    status: 403,
    description:
      'Usuário não tem permissão para atualizar tarefa nesse projeto.'
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto ou Tarefa não encontrados.'
  })
  updateTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('id') id: string,
    @Param('task_id') taskId: string,
    @CurrentUser() currentUser: CurrentUserRequest
  ) {
    if (Number.isNaN(+id)) {
      throw new NotFoundException('Projeto não encontrado');
    }
    if (Number.isNaN(+taskId)) {
      throw new NotFoundException('Tarefa não encontrado');
    }

    return this.tasksService.update(+id, createTaskDto, currentUser, +taskId);
  }

  @Post('/:id/associate_members')
  @ApiResponse({
    status: 201,
    description:
      'Mensagem de sucesso na associação de novos membros no projeto.',
    type: ResponseAssociateMembersDto
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados informados para associação de novos membros no projeto estão no formato incorreto.'
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado.'
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para associar tarefa nesse projeto.'
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.'
  })
  addMembers(
    @Body() associateMembersDto: AssociateMembersDto,
    @CurrentUser() currentUser: CurrentUserRequest,
    @Param('id') id: string
  ) {
    if (Number.isNaN(+id)) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return this.projectsService.associateMembers(
      associateMembersDto,
      currentUser,
      +id
    );
  }

  @Delete('/:id/unassociate_members')
  @ApiResponse({
    status: 200,
    description: 'Mensagem de sucesso na exclusão dos membros no projeto.',
    type: ResponseUnassociateMembersDto
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados informados para exclusão dos membros no projeto estão no formato incorreto.'
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autenticado.'
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para excluir membros nesse projeto.'
  })
  @ApiResponse({
    status: 404,
    description: 'Projeto não encontrado.'
  })
  removeMembers(
    @Body() unassociateMembersDto: UnassociateMembersDto,
    @CurrentUser() currentUser: CurrentUserRequest,
    @Param('id') id: string
  ) {
    if (Number.isNaN(+id)) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return this.projectsService.unassociateMembers(
      unassociateMembersDto,
      currentUser,
      +id
    );
  }

  @Get()
  findAll(@Query() pagination: PaginationDto): Promise<ResponseListProjecsDto> {
    return this.projectsService.findAll(pagination);
  }

  @Get('/:id/tasks')
  findAllTasksByProject(
    @Query() pagination: PaginationDto,
    @Param('id') id: string
  ): Promise<ResponseListTasksDto> {
    if (Number.isNaN(+id)) {
      throw new NotFoundException('Projeto não encontrado');
    }
    return this.tasksService.findAll(+id, pagination);
  }
}
