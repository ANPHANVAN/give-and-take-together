import { EErrorCodes } from './errorCode';

// Định nghĩa cấu trúc 1 lỗi chuẩn
interface IErrorDefinition {
  message: string;
  status: number;
}

// Map Code -> Definition
export const ERROR_MESSAGES: Record<string, IErrorDefinition> = {
  [EErrorCodes.MISSING_FIELDS]: {
    message: 'Thiếu trường thông tin cần thiết',
    status: 400,
  },
  [EErrorCodes.AUTH_LOGIN_FAIL]: {
    message: 'Email hoặc mật khẩu không chính xác',
    status: 401,
  },
  [EErrorCodes.AUTH_EMAIL_EXIST]: {
    message: 'Email này đã được đăng ký',
    status: 400,
  },
  [EErrorCodes.AUTH_WRONG_PASSWORD]: {
    message: 'Mật khẩu không chính xác',
    status: 400,
  },
  [EErrorCodes.USER_NOT_FOUND]: {
    message: 'Không tìm thấy người dùng',
    status: 404,
  },
  [EErrorCodes.PRODUCT_OUT_OF_STOCK]: {
    message: 'Sản phẩm này đã hết hàng',
    status: 400,
  },
  // Default
  [EErrorCodes.INTERNAL_SERVER_ERROR]: {
    message: 'Lỗi hệ thống, vui lòng thử lại sau',
    status: 500,
  },
};
