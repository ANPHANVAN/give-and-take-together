import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { DatabaseModule } from './infras/database/database.module';
import { StorageModule } from './infras/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig, postgresConfig, redisConfig, authConfig, minioConfig } from './config/appConfig';
import { LoggerModule } from 'nestjs-pino';
import { Response, Request } from 'express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from './infras/mail/mail.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        customLogLevel: function (req: Request, res: Response) {
          if (res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            ignore: 'req.headers,res.headers',
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, postgresConfig, redisConfig, authConfig, minioConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 60,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    DatabaseModule,
    StorageModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
