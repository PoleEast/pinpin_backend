import { CurrentWeatherDto, WeatherForecastDataDto, WeatherForecastDto } from "@/dtos/weather.dto.js";
import { CurrentWeatherResponse, WeatherForecastResponse } from "@/interfaces/openWeather.interface.js";

function mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDto(data: CurrentWeatherResponse): CurrentWeatherDto {
  const result: CurrentWeatherDto = {
    country: data.sys.country,
    city: data.name,
    data: {
      unixTimestamp: data.dt,
      temperature: data.main.temp,
      maxTemperature: data.main.temp_max,
      minTemperature: data.main.temp_min,
      feelsLikeTemperature: data.main.feels_like,
      humidity: data.main.humidity,
      visibility: data.visibility,
      weather: data.weather[0]?.description ?? "",
      cloud: data.clouds.all,
      windSpeed: data.wind.speed,
      rain: data.rain?.["1h"] ?? undefined,
      snow: data.snow?.["1h"] ?? undefined,
      icon: data.weather[0]?.icon ?? "",
    },
  };

  return result;
}

function mapOpenWeatherWeatherForecastResponseToWeatherForecastDto(data: WeatherForecastResponse): WeatherForecastDto {
  const result: WeatherForecastDto = {
    country: data.city.country,
    city: data.city.name,
    data: data.list.map<WeatherForecastDataDto>((weatherData) => ({
      unixTimestamp: weatherData.dt,
      temperature: weatherData.main.temp,
      maxTemperature: weatherData.main.temp_max,
      minTemperature: weatherData.main.temp_min,
      feelsLikeTemperature: weatherData.main.feels_like,
      PoP: weatherData.pop,
      humidity: weatherData.main.humidity,
      visibility: weatherData.visibility,
      cloud: weatherData.clouds.all,
      weather: weatherData.weather[0]?.description ?? "",
      windSpeed: weatherData.wind.speed,
      rain: weatherData.rain?.["3h"] ?? undefined,
      snow: weatherData.snow?.["3h"] ?? undefined,
      icon: weatherData.weather[0]?.icon ?? "",
      periodOfTime: weatherData.sys?.pod === "d" ? "Day" : "Night",
    })),
  };

  return result;
}

export { mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDto, mapOpenWeatherWeatherForecastResponseToWeatherForecastDto };
