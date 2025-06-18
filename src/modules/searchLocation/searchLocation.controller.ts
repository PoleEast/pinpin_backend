import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { SearchLocationService } from "./searchLocation.service.js";
import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { autoCompleteDTO } from "../../dtos/searchLocation.dto.js";
import { ApiResponseDTO } from "pinpin_library";
import { LimitedArrayPipe } from "../../common/decorators/limitedArrayPipe.decorator.js";

@ApiTags("地點搜尋")
@Controller("searchLocation")
export class SearchLocationController {
  constructor(private readonly searchLocationService: SearchLocationService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "文字搜尋地點" })
  @ApiCommonResponses(HttpStatus.OK, "地點搜尋成功")
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 30)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 1000 * 10 } })
  @Get("textSearchLocation")
  async getTextSearchLocation(@Query("keyword") keyword: string) {
    const result = await this.searchLocationService.getTextSearchLocation(keyword);

    return {
      statusCode: HttpStatus.OK,
      message: "地點搜尋成功",
      data: result,
    };
  }

  //TODO:驗證主要標籤，API限制最多5個
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "關鍵字自動補全" })
  @ApiCommonResponses(HttpStatus.OK, "關鍵字自動補全成功", autoCompleteDTO)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @ApiQuery({ name: "primaryTypes", type: String, isArray: true, required: false })
  @Get("autoComplete/:keyword")
  async getAutoComplate(
    @Param("keyword") keyword: string,
    @Query("sessionToken", new ParseUUIDPipe({ version: "4" })) sessionToken: string,
    @Query(
      "primaryTypes",
      new LimitedArrayPipe(5, {
        items: String,
        separator: ",",
        optional: true,
      }),
    )
    primaryTypes?: string[],
  ): Promise<ApiResponseDTO<autoCompleteDTO[]>> {
    const result = await this.searchLocationService.getAutoComplete(keyword, sessionToken, primaryTypes);

    return {
      statusCode: HttpStatus.OK,
      message: "地點搜尋成功",
      data: result,
    };
  }
}
