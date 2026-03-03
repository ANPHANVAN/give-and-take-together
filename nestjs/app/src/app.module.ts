import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { DatabaseModule } from './infra/database/database.module';
import { StorageModule } from './infra/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, postgresConfig, redisConfig, authConfig, minioConfig } from './config/appConfig';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
