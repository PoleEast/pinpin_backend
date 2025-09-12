import { InjectionToken } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Coordinates } from "pinpin_library";

interface OpenWeatherAsyncConfig {
  useFactory: (configService: ConfigService) => Promise<ConfigOptions> | ConfigOptions;
  inject?: InjectionToken[];
}

interface ConfigOptions {
  apiKey?: string;
}

interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: SystemData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
  rain?: Rain;
  snow?: Snow;
}

interface WeatherForecastResponse {
  cod: number;
  message: number;
  cnt: number;
  list: WeatherForecastData[];
  city: City;
}

interface WeatherForecastData {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  snow?: Snow;
  sys: { pod: "n" | "d" };
  dt_txt: string;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

interface Clouds {
  all: number;
}

interface Rain {
  /** 過去1小時降水量 (mm) */
  "1h"?: number;
  /** 過去3小時降水量 (mm) */
  "3h"?: number;
}

interface Snow {
  /** 過去1小時降雪量 (mm) */
  "1h"?: number;
  /** 過去1小時降雪量 (mm) */
  "3h"?: number;
}

interface SystemData {
  country: string;
  sunrise: number;
  sunset: number;
}

interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timeZone: number;
  sunrise: number;
  sunset: number;
}

export type {
  ConfigOptions,
  OpenWeatherAsyncConfig,
  CurrentWeatherResponse,
  WeatherForecastResponse,
  WeatherCondition,
  MainWeatherData,
  Wind,
  Clouds,
  Rain,
  Snow,
  SystemData,
};
