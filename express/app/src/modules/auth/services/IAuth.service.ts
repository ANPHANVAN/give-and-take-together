import { TLoginByFormDTO } from '../dto/login.dto';

export interface IAuthResult {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthService {
  loginByForm(dto: TLoginByFormDTO): Promise<IAuthResult>;

  refreshToken(refreshToken: string): Promise<IAuthResult>;

  logout(userId: string, refreshToken?: string): Promise<void>;
}
