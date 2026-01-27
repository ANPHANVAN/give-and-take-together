export const EErrorCodes = {
  // Module AUTH
  AUTH_LOGIN_FAIL: 'AUTH_LOGIN_FAIL',
  AUTH_EMAIL_EXIST: 'AUTH_EMAIL_EXIST',

  // Module USER
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_BLOCKED: 'USER_BLOCKED',

  // Module PRODUCT
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',

  // System
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

// Tạo type để TypeScript gợi ý code
export type ErrorCodeType = keyof typeof EErrorCodes;
