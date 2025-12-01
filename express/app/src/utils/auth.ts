import * as crypto from 'crypto';

/**
 * Tạo một chuỗi ngẫu nhiên (state) để chống CSRF.
 * @param length Độ dài chuỗi mong muốn.
 * @returns Chuỗi base64 URL safe ngẫu nhiên.
 */
export const generateRandomString = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('base64url');
};

// Sau đó, import và sử dụng trong routes/auth.ts
// import { generateRandomString } from '../utils/auth';
