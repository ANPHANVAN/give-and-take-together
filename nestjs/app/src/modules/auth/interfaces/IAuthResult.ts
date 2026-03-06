import { Role } from '@/generated/enums';

export interface IAuthResult {
  user: {
    id: string;
    role: Role;
    name?: string;
  };
  accessToken: string;
  refreshToken?: string;
}
