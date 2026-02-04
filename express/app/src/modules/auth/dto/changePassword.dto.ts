import z from 'zod';

export const ChangePasswordDTO = z.object({
  userId: z.string(),
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type TChangePasswordDTO = z.infer<typeof ChangePasswordDTO>;
