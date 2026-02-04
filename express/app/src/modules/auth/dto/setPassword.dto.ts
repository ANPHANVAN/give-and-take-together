import z from 'zod';

export const SetPasswordDTO = z.object({
  userId: z.string(),
  newPassword: z.string().min(6),
});

export type TSetPasswordDTO = z.infer<typeof SetPasswordDTO>;
