import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TagsModule } from './modules/tags/tags.module';
import { TaskModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    TagsModule,
    TaskModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
