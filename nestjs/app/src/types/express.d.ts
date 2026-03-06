import { IAuthResult } from '@/modules/auth/auth.service';
import { IPayloadJWT } from '@/modules/auth/interfaces/IPayloadJWT';

interface IFileRequest extends Express.Multer.File {
  url_file?: string;
  base_url?: string;
}

declare global {
  namespace Express {
    interface User extends IAuthResult {}

    interface Request {
      file?: IFileRequest;
      userInfo?: IPayloadJWT;
    }
  }
}

export {};
