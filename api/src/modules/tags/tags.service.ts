import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { PrismaService } from 'src/db/prisma.service';
import { TagsMapper } from './tags.mapper.service';
import { ResponseTagDto } from './dto/response-tag.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ResponseListTagsDto } from './dto/response-list-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsMapper: TagsMapper
  ) {}

  async create(createTagDto: CreateTagDto): Promise<ResponseTagDto> {
    Logger.log('TagsService/create');
    const { title } = createTagDto;

    const tagAlreadyExists = await this.prisma.tag.findUnique({
      where: {
        title
      }
    });

    if (tagAlreadyExists) {
      throw new ConflictException('Tag já cadastrada');
    }

    const tag = await this.prisma.tag.create({
      data: {
        title
      }
    });

    return this.tagsMapper.toResponse(tag);
  }

  async findAll(paginationDto: PaginationDto): Promise<ResponseListTagsDto> {
    const { limit, page } = paginationDto;
    const itemsPerPage = limit || 10;
    const currentPage = page || 1;
    const skip = (currentPage - 1) * itemsPerPage;

    const totalItems = await this.prisma.tag.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const data = await this.prisma.tag.findMany({
      skip,
      take: itemsPerPage
    });

    const tags = data.map((tag) => this.tagsMapper.toResponse(tag));

    return {
      tags,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
      totalItems
    };
  }
}
