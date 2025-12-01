// middlewares/upload.js
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
type AllowTypeExt = string[] | null;

/**
 * @param {string} baseURL /upload/{baseURL}
 * @returns req.file
 */
const upload = (baseURL: string, allowTypeExt: AllowTypeExt) => {
  // Cấu hình nơi lưu file và tên file
  const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
      const dest = `/app/src/uploads/${baseURL}`;
      fs.mkdirSync(dest, { recursive: true }); // Tạo thư mục nếu chưa có
      cb(null, dest);
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
      const uniqueSuffix = Date.now(); /* + '-' + Math.round(Math.random() * 100) */
      const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, uniqueSuffix + '-' + safeName);
    },
  });

  // Giới hạn loại file nếu muốn (ví dụ chỉ nhận PDF và DOCX)
  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowTypeExt) {
      cb(null, true); // Cho phép tất cả loại file
      return;
    }
    if (allowTypeExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${allowTypeExt?.join(', ')} files are allowed`));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // Giới hạn 100MB
  });
};

/**
 *
 * @param {string} baseURL /upload/{baseURL}
 * @param {string} fileInputName fileName: Ex: file-upload
 * @returns req.file req.file.url_name
 */
const uploadSingle = (baseURL: string, fileInputName: string, allowTypeExt: AllowTypeExt = null) => [
  upload(baseURL, allowTypeExt).single(fileInputName),
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    if (req.file?.filename) {
      const filename = req.file.filename;
      req.file.url_file = `/uploads/${baseURL}/${filename}`;
      req.file.base_url = baseURL;
      req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      next();
    } else {
      return res.status(400).json({ message: 'Không Tìm Thấy File' });
    }
  },
];

module.exports = uploadSingle;
