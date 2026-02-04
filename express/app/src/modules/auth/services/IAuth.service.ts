import { TLoginByFormDTO, TLoginByOAuthDTO } from '../dto/login.dto';
import { Role } from '../../../generated/enums';
import { TChangePasswordDTO } from '../dto/changePassword.dto';

export interface IAuthResult {
  user: {
    id: string;
    role: Role;
    name?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthService {
  loginByForm(dto: TLoginByFormDTO): Promise<IAuthResult>;

  refreshToken(refreshToken: string): Promise<IAuthResult>;

  logout(userId: string, refreshToken?: string): Promise<void>;

  getUrlredirectToGoogleLogin(): Promise<string>;

  loginByGoogle(code: string): Promise<IAuthResult>;

  loginWithOAuth(dto: TLoginByOAuthDTO): Promise<IAuthResult>;

  changePassword(changePasswordDTO: TChangePasswordDTO): Promise<void>;
}
