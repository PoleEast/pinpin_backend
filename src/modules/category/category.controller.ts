import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { CountryDTO } from "../../dtos/category.dto.js";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service.js";
import { ApiResponseDTO } from "pinpin_library";

@ApiTags("類別")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "國家資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "國家資料查詢成功", CountryDTO)
  @Get("getCountry")
  async getCountry(): Promise<ApiResponseDTO<CountryDTO[]>> {
    const result = await this.categoryService.getCountry();

    const ApiResponse: ApiResponseDTO<CountryDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "國家資料查詢成功",
      data: result,
    };

    return ApiResponse;
  }
}
