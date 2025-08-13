import { CurrentWeatherDTO } from "@/dtos/weather.dto.js";
import { CurrentWeatherResponse } from "@/interfaces/openWeather.interface.js";

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

export { mapOpenWeatherCurrentWeatherResponseToCurrentWeatherDTO };
