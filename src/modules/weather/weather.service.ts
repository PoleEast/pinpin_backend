import { Injectable } from "@nestjs/common";
import { OpenWeatherService } from "../openWeather/openWeather.service.js";
import { CoordinatesDTO } from "@/dtos/weather.dto.js";
import { mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO } from "../../common/mappers/weatherMapper.map.js";

@Injectable()
export class WeatherService {
  constructor(private readonly openWeatherService: OpenWeatherService) {}

  async getCurrentWeather(coordinatesDTO: CoordinatesDTO) {
    const response = await this.openWeatherService.getCurrentWeather(coordinatesDTO);

    const result = mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO(response);

    return result;
  }
}
