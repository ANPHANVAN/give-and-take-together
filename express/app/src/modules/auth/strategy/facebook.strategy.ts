import envConfig from '@/config/envConfig';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { container } from '@/config/container';
import { AuthService } from '../services/auth.service';

passport.use(
  new FacebookStrategy(
    {
      clientID: envConfig.auth.FACEBOOK_CLIENT_ID,
      clientSecret: envConfig.auth.FACEBOOK_CLIENT_SECRET,
      callbackURL:
        (envConfig.app.NODE_ENV === 'development' ? 'http://localhost:8000' : envConfig.app.API_HOST) +
        '/api/auth/facebook/callback',
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      try {
        const authService = container.resolve(AuthService);
        console.log(profile);

        const result = await authService.loginWithOAuth({
          provider: 'FACEBOOK',
          providerUserId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
        });

        cb(null, result);
      } catch (err) {
        cb(err);
      }
    },
  ),
);
