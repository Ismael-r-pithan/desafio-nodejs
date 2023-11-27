import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TagsValidationService {
  constructor(private readonly prisma: PrismaService) {}

  async validationTagExists(tagId: number[]) {
    Logger.log('TagsValidationService/validationTagExists');
    try {
      const tags = await this.prisma.tag.findMany({
        where: {
          id: {
            in: tagId
          }
        }
      });

      const existingTagIds = tags.map((tag) => tag.id);
      const missingTagIds = tagId.filter((id) => !existingTagIds.includes(id));

      if (missingTagIds.length > 0) {
        throw new NotFoundException(
          `Tags com IDs [${missingTagIds.join(', ')}] não encontradas`
        );
      }
    } catch (error) {
      Logger.error(
        'Error - TagsValidationService/validationTagExists ',
        JSON.stringify({ error })
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Servidor indisponível no momento, tente novamente mais tarde.'
      );
    }
  }
}
