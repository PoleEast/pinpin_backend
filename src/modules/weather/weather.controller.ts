import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { WeatherService } from "./weather.service.js";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CoordinatesDTO, CurrentWeatherDTO } from "../../dtos/weather.dto.js";
import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ApiResponseDTO } from "pinpin_library";

//TODO:用戶驗證

@ApiTags("天氣")
@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "查詢當前天氣狀態" })
  @ApiCommonResponses(HttpStatus.OK, "當前天氣查詢成功", CurrentWeatherDTO)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 30)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 1000 * 10 } })
  @Get("currentWeather")
  async getCurrentWeather(@Query() coordinatesDTO: CoordinatesDTO): Promise<ApiResponseDTO<CurrentWeatherDTO>> {
    const result = await this.weatherService.getCurrentWeather(coordinatesDTO);

    return {
      statusCode: HttpStatus.OK,
      message: "當前天氣查詢成功",
      data: result,
    };
  }
}
