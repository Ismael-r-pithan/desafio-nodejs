import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ResponseTagDto } from './dto/response-tag.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/security/jwt-auth.guard';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ResponseListTagsDto } from './dto/response-list-tags.dto';

@ApiTags('Tags')
@Controller({ path: 'tags', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-token')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto): Promise<ResponseTagDto> {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listagem das tags e informações necessárias para paginação.',
    type: ResponseListTagsDto
  })
  findAll(@Query() pagination: PaginationDto) {
    return this.tagsService.findAll(pagination);
  }
}
