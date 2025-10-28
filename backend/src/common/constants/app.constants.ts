// src/common/constants/app.constants.ts
export const MESSAGES = {
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',

  USER: {
    USER_ALREADY_EXISTS: 'User with this email already exists.',
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password or role',
    NOT_FOUND: 'User not found',
  },

  AUTH: {
    TOKEN_EXPIRED: 'Token expired',
    UNAUTHORIZED: 'Unauthorized access',
  },

  SESSION: {
    CREATED: 'Session created successfully',
    INVALID: 'Invalid session',
  },
};

export const ROLES = ['admin', 'vendor', 'approver', 'buyer'];

export const RESPONSE_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
