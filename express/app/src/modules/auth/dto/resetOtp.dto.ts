import z from 'zod';

export const ResetOtp = z.object({
  email: z.email().min(3),
});

export type TResetOtp = z.infer<typeof ResetOtp>;
