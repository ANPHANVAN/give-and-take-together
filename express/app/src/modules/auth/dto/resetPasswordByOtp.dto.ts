import z from 'zod';

export const ResetPasswordByOtp = z.object({
  email: z.email().min(3),
  otp: z.string().length(6),
  password: z.string().min(6),
});

export type TResetPasswordByOtp = z.infer<typeof ResetPasswordByOtp>;
