import { Injectable } from "@nestjs/common";
import { OpenWeatherService } from "../openWeather/openWeather.service.js";
import { CurrentWeatherDto, WeatherForecastDto } from "@/dtos/weather.dto.js";
import {
  mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDto,
  mapOpenWeatherWeatherForecastResponseToWeatherForecastDto,
} from "../../common/mappers/weatherMapper.map.js";
import { Coordinates } from "pinpin_library";

@Injectable()
export class WeatherService {
  constructor(private readonly openWeatherService: OpenWeatherService) {}

  async getCurrentWeather(coordinatesDto: Coordinates): Promise<CurrentWeatherDto> {
    const response = await this.openWeatherService.getCurrentWeather(coordinatesDto);

    const result = mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDto(response);

    return result;
  }

  async getWeatherForecast(coordinatesDto: Coordinates): Promise<WeatherForecastDto> {
    const response = await this.openWeatherService.getWeatherForecast(coordinatesDto);

    const result = mapOpenWeatherWeatherForecastResponseToWeatherForecastDto(response);

    return result;
  }
}
