import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";

function ApiCommonResponses(
  successStatusCode = HttpStatus.OK,
  successDescription = "success",
) {
  return applyDecorators(
    ApiResponse({
      status: successStatusCode,
      description: successDescription,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: "請求格式錯誤",
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: "未授權",
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: "禁止存取",
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: "找不到資源",
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: "內部伺服器錯誤",
    }),
  );
}

export default ApiCommonResponses;
