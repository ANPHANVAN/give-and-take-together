import { AuthProvider } from '@/generated/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginByFormDTO {
  @MinLength(3)
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginByOAuthDTO {
  @IsNotEmpty()
  @IsEnum(['FACEBOOK', 'GOOGLE', 'GITHUB'])
  provider: AuthProvider;

  @IsNotEmpty()
  @IsString()
  providerUserId: string;
  @IsOptional()
  @IsString()
  email: string | undefined;

  @IsNotEmpty()
  @IsString()
  name: string;
}
