import z from 'zod';

export const LoginByFormDTO = z.object({
  email: z.email().min(3),
  password: z.string().min(6),
});
export type TLoginByFormDTO = z.infer<typeof LoginByFormDTO>;

export const LoginByOAuthDTO = z.object({
  provider: z.enum(['FACEBOOK', 'GOOGLE', 'GITHUB']),
  providerUserId: z.string(),
  email: z.string().optional(),
  name: z.string(),
});
export type TLoginByOAuthDTO = z.infer<typeof LoginByOAuthDTO>;
