import { CoordinatesDTO } from "@/dtos/weather.dto.js";
import { INJECTION_TOKEN } from "../../common/constants/constants.js";
import { ConfigOptions, CurrentWeatherResponse } from "@/interfaces/openWeather.interface.js";
import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { OPENWEATHER_CONFIG } from "pinpin_library";

@Injectable()
export class OpenWeatherService {
  private readonly apikey: string;

  private readonly currnetWeatherURL = `${OPENWEATHER_CONFIG.BASE_URL}/${OPENWEATHER_CONFIG.VERSION}/${OPENWEATHER_CONFIG.ENDPOINT.CURRENT_WEATHER}`;
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
    const urlConfig = this.generateCurrentWeatherURL(coordinatesDTO);

    try {
      const response = await fetch(urlConfig);

      if (!response.ok) {
        throw new Error(`http: ${response.status} ,statusText: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new ServiceUnavailableException(error, "Weather service is temporarily unavailable");
    }
  }

  private generateCurrentWeatherURL(coordinatesDTO: CoordinatesDTO): URL {
    const urlConfig = new URL(this.currnetWeatherURL);
    urlConfig.searchParams.set("lat", coordinatesDTO.lat.toString());
    urlConfig.searchParams.set("lon", coordinatesDTO.lng.toString());
    urlConfig.searchParams.set("appid", this.apikey);
    urlConfig.searchParams.set("units", this.temperatureUnit);
    urlConfig.searchParams.set("lang", this.language);

    return urlConfig;
  }
}
