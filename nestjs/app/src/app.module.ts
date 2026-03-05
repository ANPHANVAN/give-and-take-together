import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { DatabaseModule } from './infras/database/database.module';
import { StorageModule } from './infras/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, postgresConfig, redisConfig, authConfig, minioConfig } from './config/appConfig';
import { GuardsModule } from './common/guards/guards.module';
import { InterceptorsModule } from './common/interceptors/interceptors.module';
import { PipesModule } from './common/pipes/pipes.module';
import { MiddlewaresModule } from './common/middlewares/middlewares.module';
import { FiltersModule } from './common/filters/filters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, postgresConfig, redisConfig, authConfig, minioConfig],
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    DatabaseModule,
    StorageModule,
    GuardsModule,
    InterceptorsModule,
    PipesModule,
    MiddlewaresModule,
    FiltersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
