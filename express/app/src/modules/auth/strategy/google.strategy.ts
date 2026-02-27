import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import { container } from '@/config/container';
import envConfig from '@/config/envConfig';
import { AuthService } from '../auth.service';
passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.auth.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.auth.GOOGLE_CLIENT_SECRET,
      callbackURL:
        (envConfig.app.NODE_ENV === 'development' ? 'http://localhost:8000' : envConfig.app.API_HOST) +
        '/api/auth/google/callback',
    },
    async function (_accessToken, _refreshToken, profile, cb) {
      try {
        const authService = container.resolve(AuthService);
        const result = await authService.loginWithOAuth({
          provider: 'GOOGLE',
          providerUserId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
        });
        cb(null, result as any);
      } catch (error) {
        cb(error);
      }
    },
  ),
);
