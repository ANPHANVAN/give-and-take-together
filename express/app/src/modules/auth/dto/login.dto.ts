import z from 'zod';

export const LoginByFormDTO = z.object({
  email: z.email().min(3),
  password: z.string().min(6),
});

export type TLoginByFormDTO = z.infer<typeof LoginByFormDTO>;
