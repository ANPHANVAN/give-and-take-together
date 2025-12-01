interface IUserRequest {
  _id: string;
  role: string;
}

interface IFileRequest extends Express.Multer.File {
  url_file?: string;
  base_url?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TUserRequest;
      file?: IFileRequest;
    }
  }
}

export {};
