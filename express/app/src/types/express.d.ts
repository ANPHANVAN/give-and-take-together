import { IAuthResult } from '@/modules/auth/services/IAuth.service';

interface IUserRequest {
  id: string;
  role: string;
}

interface IFileRequest extends Express.Multer.File {
  url_file?: string;
  base_url?: string;
}

declare global {
  namespace Express {
    interface User extends IUserRequest, IAuthResult {}

    interface Request {
      file?: IFileRequest;
    }
  }
}

export {};
