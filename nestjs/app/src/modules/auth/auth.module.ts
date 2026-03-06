import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpResetRepository } from './otp-reset.repository';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { MailModule } from '@/infras/mail/mail.module';
import { AuthenticationGuard } from './guards/authentication.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('auth.authJwtSecret'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    UsersModule,
    MailModule,
  ],
  exports: [AuthenticationGuard],
  controllers: [AuthController],
  providers: [AuthService, AuthService, OtpResetRepository, GoogleStrategy, FacebookStrategy, AuthenticationGuard],
})
export class AuthModule {}
