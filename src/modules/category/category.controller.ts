import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import {
  CountryDTO,
  CurrencyDTO,
  LanguageDTO,
  SettingDTO,
  travelInterestDTO,
  TravelInterestTypeDTO,
  TravelStyleDTO,
} from "../../dtos/category.dto.js";
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

    const apiResponse: ApiResponseDTO<CountryDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "國家資料查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "幣別資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "幣別資料查詢成功", CurrencyDTO)
  @Get("getCurrency")
  async getCurrency(): Promise<ApiResponseDTO<CurrencyDTO[]>> {
    const result = await this.categoryService.getCurrency();

    const apiResponse: ApiResponseDTO<CurrencyDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "幣別資料查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "語言資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "語言資料查詢成功", LanguageDTO)
  @Get("getLanguage")
  async getLanguage(): Promise<ApiResponseDTO<LanguageDTO[]>> {
    const result = await this.categoryService.getLanguage();

    const apiResponse: ApiResponseDTO<LanguageDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "語言資料查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "旅遊興趣類別查詢" })
  @ApiCommonResponses(HttpStatus.OK, "旅遊興趣類別查詢成功", TravelInterestTypeDTO)
  @Get("getTravelInterestType")
  async getTravelInterestType(): Promise<ApiResponseDTO<TravelInterestTypeDTO[]>> {
    const result = await this.categoryService.getTravelInterestType();

    const apiResponse: ApiResponseDTO<TravelInterestTypeDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "旅遊興趣類別查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "旅遊興趣類查詢" })
  @ApiCommonResponses(HttpStatus.OK, "旅遊興趣查詢成功", travelInterestDTO)
  @Get("getTravelInterest")
  async getTravelInterest(): Promise<ApiResponseDTO<travelInterestDTO[]>> {
    const result = await this.categoryService.getTravelInterest();

    const apiResponse: ApiResponseDTO<travelInterestDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "旅遊興趣類別查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "旅遊風格查詢" })
  @ApiCommonResponses(HttpStatus.OK, "旅遊風格查詢成功", TravelStyleDTO)
  @Get("getTravelStyles")
  async getTravelStyles(): Promise<ApiResponseDTO<TravelStyleDTO[]>> {
    const result = await this.categoryService.getTravelStyles();

    const apiResponse: ApiResponseDTO<TravelStyleDTO[]> = {
      statusCode: HttpStatus.OK,
      message: "旅遊風格查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "設定頁面資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "設定頁面資料查詢成功", SettingDTO)
  @Get("getSettingData")
  async getSettingData(): Promise<ApiResponseDTO<SettingDTO>> {
    const result = await this.categoryService.getSettingData();

    const apiResponse: ApiResponseDTO<SettingDTO> = {
      statusCode: HttpStatus.OK,
      message: "設定頁面資料查詢成功",
      data: result,
    };

    return apiResponse;
  }
}
