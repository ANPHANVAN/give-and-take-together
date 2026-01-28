import { z } from 'zod';

export const CreateUserDTO = z.object({
  email: z.email().min(3),
  fullname: z.string().min(6),
  password: z.string().min(6),
});

export type TCreateUserDTO = z.infer<typeof CreateUserDTO>;
