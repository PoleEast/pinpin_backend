import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";

export class ApiResponseDTO<T = unknown> implements ApiResponseDTO<T> {
  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: "Success" })
  message!: string;

  @ApiProperty({ description: "返回的數據" })
  data?: T;
}

export function ApiCommonResponses<T extends Type<unknown>>(
  successStatusCode: number = HttpStatus.OK,
  successDescription: string = "Success",
  successType?: T,
) {
  if (!successType) {
    // 無數據類型的情況
    return applyDecorators(
      ApiResponse({
        status: successStatusCode,
        description: successDescription,
        type: ApiResponseDTO,
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

  // 有數據類型的情況，使用 schema 引用方式
  return applyDecorators(
    ApiExtraModels(successType, ApiResponseDTO),
    ApiResponse({
      status: successStatusCode,
      description: successDescription,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDTO) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(successType),
              },
            },
          },
        ],
      },
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
