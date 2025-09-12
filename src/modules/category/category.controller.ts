import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import {
  CountryDto,
  CurrencyDto,
  LanguageDto,
  SettingDto,
  travelInterestDto,
  TravelInterestTypeDto,
  TravelStyleDto,
} from "../../dtos/category.dto.js";
import { Controller, Get, HttpCode, HttpStatus, Logger } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service.js";
import { ApiResponse } from "pinpin_library";

@ApiTags("類別")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "國家資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "國家資料查詢成功", CountryDto)
  @Get("getCountry")
  async getCountry(): Promise<ApiResponse<CountryDto[]>> {
    const result = await this.categoryService.getCountry();

    const apiResponse: ApiResponse<CountryDto[]> = {
      statusCode: HttpStatus.OK,
      message: "國家資料查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "幣別資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "幣別資料查詢成功", CurrencyDto)
  @Get("getCurrency")
  async getCurrency(): Promise<ApiResponse<CurrencyDto[]>> {
    const result = await this.categoryService.getCurrency();

    const apiResponse: ApiResponse<CurrencyDto[]> = {
      statusCode: HttpStatus.OK,
      message: "幣別資料查詢成功",
      data: result,
    };

    Logger.log(`幣別資料查詢成功`);

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "語言資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "語言資料查詢成功", LanguageDto)
  @Get("getLanguage")
  async getLanguage(): Promise<ApiResponse<LanguageDto[]>> {
    const result = await this.categoryService.getLanguage();

    const apiResponse: ApiResponse<LanguageDto[]> = {
      statusCode: HttpStatus.OK,
      message: "語言資料查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "旅遊興趣類別查詢" })
  @ApiCommonResponses(HttpStatus.OK, "旅遊興趣類別查詢成功", TravelInterestTypeDto)
  @Get("getTravelInterestType")
  async getTravelInterestType(): Promise<ApiResponse<TravelInterestTypeDto[]>> {
    const result = await this.categoryService.getTravelInterestType();

    const apiResponse: ApiResponse<TravelInterestTypeDto[]> = {
      statusCode: HttpStatus.OK,
      message: "旅遊興趣類別查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "旅遊興趣類查詢" })
  @ApiCommonResponses(HttpStatus.OK, "旅遊興趣查詢成功", travelInterestDto)
  @Get("getTravelInterest")
  async getTravelInterest(): Promise<ApiResponse<travelInterestDto[]>> {
    const result = await this.categoryService.getTravelInterest();

    const apiResponse: ApiResponse<travelInterestDto[]> = {
      statusCode: HttpStatus.OK,
      message: "旅遊興趣類別查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "旅遊風格查詢" })
  @ApiCommonResponses(HttpStatus.OK, "旅遊風格查詢成功", TravelStyleDto)
  @Get("getTravelStyles")
  async getTravelStyles(): Promise<ApiResponse<TravelStyleDto[]>> {
    const result = await this.categoryService.getTravelStyles();

    const apiResponse: ApiResponse<TravelStyleDto[]> = {
      statusCode: HttpStatus.OK,
      message: "旅遊風格查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "設定頁面資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "設定頁面資料查詢成功", SettingDto)
  @Get("getSettingData")
  async getSettingData(): Promise<ApiResponse<SettingDto>> {
    const result = await this.categoryService.getSettingData();

    const apiResponse: ApiResponse<SettingDto> = {
      statusCode: HttpStatus.OK,
      message: "設定頁面資料查詢成功",
      data: result,
    };

    return apiResponse;
  }
}
