import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Profile } from 'passport';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.getOrThrow<string>('auth.authFacebookClientId'),
      clientSecret: config.getOrThrow<string>('auth.authFacebookClientSecret'),
      callbackURL: config.getOrThrow<string>('app.appApiHost') + '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return await this.authService.loginWithOAuth({
      provider: 'FACEBOOK',
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
    });
  }
}
