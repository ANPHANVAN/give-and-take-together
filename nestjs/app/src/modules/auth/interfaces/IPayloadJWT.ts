import { Role } from '@/generated/enums';

export interface IPayloadJWT {
  id: string;
  role: Role;
}
