import { Injectable } from "@nestjs/common";
import { OpenWeatherService } from "../openWeather/openWeather.service.js";
import { CoordinatesDTO, CurrentWeatherDTO, WeatherForecastDTO } from "@/dtos/weather.dto.js";
import {
  mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO,
  mapOpenWeatherWeatherForecastResponseToWeatherForecastDTO,
} from "../../common/mappers/weatherMapper.map.js";

@Injectable()
export class WeatherService {
  constructor(private readonly openWeatherService: OpenWeatherService) {}

  async getCurrentWeather(coordinatesDTO: CoordinatesDTO): Promise<CurrentWeatherDTO> {
    const response = await this.openWeatherService.getCurrentWeather(coordinatesDTO);

    const result = mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO(response);

    return result;
  }

  async getWeatherForecast(coordinatesDTO: CoordinatesDTO): Promise<WeatherForecastDTO> {
    const response = await this.openWeatherService.getWeatherForecast(coordinatesDTO);

    const result = mapOpenWeatherWeatherForecastResponseToWeatherForecastDTO(response);

    return result;
  }
}
