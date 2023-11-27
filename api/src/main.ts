import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodFilter } from './pipes/zod-global.pipe';
import cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.use(
    cors({
      origin: [
        'https://desafio-reactjs-kohl.vercel.app',
        'https://desafio-reactjs-kohl.vercel.app/*',
        'https://desafio-reactjs-kohl.vercel.app/',
        'http://localhost:3000'
      ]
    })
  );

  app.enableVersioning({
    type: VersioningType.URI
  });

  app.useGlobalFilters(new ZodFilter());
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API - KHIPO')
    .setDescription('BACK END KHIPO - API DOCUMENT')
    .setVersion('1.0-SNAPSHOT')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/v1/documentation', app, document);

  const configService: ConfigService<Env, true> = app.get(ConfigService);

  const port = configService.get('PORT', { infer: true });

  await app.listen(port, () => {
    console.log(`Server running on port ${port}..`);
  });
}
bootstrap();
