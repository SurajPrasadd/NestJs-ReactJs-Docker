// src/common/utils/response.util.ts
import { CommonResponse } from '../dto/response.dto';
import { RESPONSE_CODE } from '../constants/app.constants';

export class ResponseUtil {
  static success<T>(message: string, data?: T): CommonResponse<T> {
    return new CommonResponse(RESPONSE_CODE.SUCCESS, message, data);
  }

  static error(
    message: string,
    code = RESPONSE_CODE.BAD_REQUEST,
  ): CommonResponse<null> {
    return new CommonResponse(code, message, null);
  }

  static handleError(
    error: unknown,
    code = RESPONSE_CODE.BAD_REQUEST,
  ): CommonResponse<null> {
    let errorMessage = 'An unknown error occurred';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return new CommonResponse(code, errorMessage, null);
  }
}
