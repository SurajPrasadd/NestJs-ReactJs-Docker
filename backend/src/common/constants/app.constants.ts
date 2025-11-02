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
    INVALID_ROLE: 'Invalid Role',
    NVALID_PASSWORD: 'Invalid Password',
    INVALID_CREDENTIALS: 'Invalid request',
    NOT_FOUND: 'User not found',
    INVALID_BUSINESS: 'Business details are required for vendor registration',
    INVALID_APPROVER:
      'Designation and Department are required for approver registration',
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

export const VENDOR = 'vendor';
export const APPROVER = 'approver';
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

export const UPLOAD_PATH = {
  IMAGE: '/uploads/products/',
};
