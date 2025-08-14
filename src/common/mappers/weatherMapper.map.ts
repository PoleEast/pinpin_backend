import { CurrentWeatherDTO, WeatherForecastDataDTO, WeatherForecastDTO } from "@/dtos/weather.dto.js";
import { CurrentWeatherResponse, WeatherForecastResponse } from "@/interfaces/openWeather.interface.js";

function mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO(data: CurrentWeatherResponse): CurrentWeatherDTO {
  const result: CurrentWeatherDTO = {
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
      rain: data.rain?.["1h"],
      snow: data.snow?.["1h"],
      icon: data.weather[0]?.icon ?? "",
    },
  };

  return result;
}

function mapOpenWeatherWeatherForecastResponseToWeatherForecastDTO(data: WeatherForecastResponse): WeatherForecastDTO {
  const result: WeatherForecastDTO = {
    country: data.city.country,
    city: data.city.name,
    data: data.list.map<WeatherForecastDataDTO>((weatherData) => ({
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
      icon: weatherData.weather[0]?.icon ?? "",
    })),
  };

  return result;
}

export { mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO, mapOpenWeatherWeatherForecastResponseToWeatherForecastDTO };
