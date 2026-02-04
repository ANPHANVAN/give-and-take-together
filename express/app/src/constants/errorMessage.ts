import { EErrorCodes } from './errorCode.enum';

interface IErrorDefinition {
  message: string;
  status: number;
}

export const ERROR_MESSAGES: Record<EErrorCodes, IErrorDefinition> = {
  /* =====================
   * COMMON / SYSTEM
   * ===================== */
  [EErrorCodes.INTERNAL_SERVER_ERROR]: {
    message: 'Lỗi hệ thống, vui lòng thử lại sau',
    status: 500,
  },
  [EErrorCodes.BAD_REQUEST]: {
    message: 'Dữ liệu gửi lên không hợp lệ',
    status: 400,
  },
  [EErrorCodes.VALIDATION_ERROR]: {
    message: 'Dữ liệu không thỏa mãn yêu cầu',
    status: 422,
  },
  [EErrorCodes.MISSING_FIELDS]: {
    message: 'Thiếu trường dữ liệu bắt buộc',
    status: 400,
  },

  /* =====================
   * AUTHENTICATION
   * ===================== */
  [EErrorCodes.AUTH_LOGIN_FAIL]: {
    message: 'Email hoặc mật khẩu không chính xác',
    status: 401,
  },
  [EErrorCodes.AUTH_UNAUTHORIZED]: {
    message: 'Bạn chưa đăng nhập',
    status: 401,
  },
  [EErrorCodes.AUTH_FORBIDDEN]: {
    message: 'Bạn không có quyền truy cập',
    status: 403,
  },
  [EErrorCodes.AUTH_TOKEN_EXPIRED]: {
    message: 'Phiên đăng nhập đã hết hạn',
    status: 401,
  },
  [EErrorCodes.AUTH_MISSING_REFRESH_TOKEN]: {
    message: 'Thiếu refresh token, vui lòng đăng nhập lại',
    status: 401,
  },
  [EErrorCodes.AUTH_INVALID_REFRESH_TOKEN]: {
    message: 'Refresh token không hợp lệ',
    status: 401,
  },
  [EErrorCodes.AUTH_LOGIN_METHOD_MISMATCH]: {
    message: 'Tài khoản này được đăng ký bằng đăng nhập mạng xã hội. Vui lòng đăng nhập bằng Google/Facebook.',
    status: 409,
  },

  /* =====================
   * AUTH - REGISTER
   * ===================== */
  [EErrorCodes.AUTH_EMAIL_EXIST]: {
    message: 'Email này đã được đăng ký',
    status: 409,
  },
  [EErrorCodes.AUTH_WRONG_PASSWORD]: {
    message: 'Mật khẩu không chính xác',
    status: 401,
  },
  [EErrorCodes.AUTH_PASSWORD_NOT_SET]: {
    message: 'Tài khoản này chưa thiết lập mật khẩu. Vui lòng tạo mật khẩu trước.',
    status: 400,
  },

  [EErrorCodes.AUTH_PASSWORD_ALREADY_SET]: {
    message: 'Tài khoản đã có mật khẩu.',
    status: 400,
  },

  /* =====================
   * USER
   * ===================== */
  [EErrorCodes.USER_NOT_FOUND]: {
    message: 'Không tìm thấy người dùng',
    status: 404,
  },
  [EErrorCodes.USER_ALREADY_EXISTS]: {
    message: 'Người dùng đã tồn tại',
    status: 409,
  },
  [EErrorCodes.USER_INACTIVE]: {
    message: 'Tài khoản đã bị vô hiệu hóa',
    status: 403,
  },

  /* =====================
   * RESOURCE / BUSINESS
   * ===================== */
  [EErrorCodes.RESOURCE_NOT_FOUND]: {
    message: 'Không tìm thấy tài nguyên',
    status: 404,
  },
  [EErrorCodes.RESOURCE_CONFLICT]: {
    message: 'Tài nguyên đang ở trạng thái xung đột',
    status: 409,
  },
  [EErrorCodes.PRODUCT_OUT_OF_STOCK]: {
    message: 'Sản phẩm này đã hết hàng',
    status: 409,
  },
  [EErrorCodes.INSUFFICIENT_PERMISSION]: {
    message: 'Bạn không đủ quyền thực hiện hành động này',
    status: 403,
  },
};
