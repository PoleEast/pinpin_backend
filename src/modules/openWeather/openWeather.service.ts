import { CoordinatesDTO } from "@/dtos/weather.dto.js";
import { INJECTION_TOKEN } from "../../common/constants/constants.js";
import { ConfigOptions, CurrentWeatherResponse, WeatherForecastResponse } from "@/interfaces/openWeather.interface.js";
import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { OPENWEATHER_CONFIG } from "pinpin_library";

@Injectable()
export class OpenWeatherService {
  private readonly apikey: string;

  private readonly temperatureUnit: string = "metric";
  private readonly language: string = "zh_tw";

  constructor(
    @Inject(INJECTION_TOKEN.OPENWEATHER_CONFIG)
    private readonly config: ConfigOptions,
  ) {
    if (!this.config.apiKey) {
      throw new Error("OpenWeather config is missing");
    }

    this.apikey = this.config.apiKey;
  }

  async getCurrentWeather(coordinatesDTO: CoordinatesDTO): Promise<CurrentWeatherResponse> {
    const url = this.generateURL(coordinatesDTO, "CURRENT_WEATHER");

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`http: ${response.status} ,statusText: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new ServiceUnavailableException(error, "Weather service is temporarily unavailable");
    }
  }

  async getWeatherForecast(coordinatesDTO: CoordinatesDTO): Promise<WeatherForecastResponse> {
    const url = this.generateURL(coordinatesDTO, "FORECAST_5_DAY");

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`http: ${response.status} ,statusText: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new ServiceUnavailableException(error, "Weather service is temporarily unavailable");
    }
  }

  private generateURL(coordinatesDTO: CoordinatesDTO, resourceType: keyof typeof OPENWEATHER_CONFIG.RESOURCES): URL {
    const baseUrl = `${OPENWEATHER_CONFIG.BASE_URL}/${OPENWEATHER_CONFIG.VERSION}/${OPENWEATHER_CONFIG.RESOURCES[resourceType]}`;

    const url = new URL(baseUrl);
    url.searchParams.set("lat", coordinatesDTO.lat.toString());
    url.searchParams.set("lon", coordinatesDTO.lng.toString());
    url.searchParams.set("appid", this.apikey);
    url.searchParams.set("units", this.temperatureUnit);
    url.searchParams.set("lang", this.language);

    return url;
  }
}
