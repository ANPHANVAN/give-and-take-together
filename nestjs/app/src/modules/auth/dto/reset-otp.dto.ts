import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetOtp {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  email: string;
}
