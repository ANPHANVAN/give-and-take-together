import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    console.log();

    super({
      clientID: config.getOrThrow<string>('auth.authGoogleClientId'),
      clientSecret: config.getOrThrow<string>('auth.authGoogleClientSecret'),
      callbackURL: 'http://localhost:8000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) {
    try {
      const result = await this.authService.loginWithOAuth({
        provider: 'GOOGLE',
        providerUserId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
      });
      return cb(null, result as any);
    } catch (error) {
      return cb(error);
    }
  }
}
