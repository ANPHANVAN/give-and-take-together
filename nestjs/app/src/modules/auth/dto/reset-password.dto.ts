import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordByOtp {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
