import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { type WeatherRequestDTO, type CurrentWeatherResponseDTO, type WeatherData, COORDINATES_VALIDATION } from "pinpin_library";

//TODO:鑽寫API參數驗證錯誤的訊息

class CoordinatesDTO implements WeatherRequestDTO {
  @ApiProperty({
    description: "經度",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(COORDINATES_VALIDATION.LAT.MIN)
  @Max(COORDINATES_VALIDATION.LAT.MAX)
  @Transform(({ value }) => parseFloat(value))
  lat: number;

  @ApiProperty({
    description: "緯度",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(COORDINATES_VALIDATION.LNG.MIN)
  @Max(COORDINATES_VALIDATION.LNG.MAX)
  @Transform(({ value }) => parseFloat(value))
  lng: number;
}

class CurrentWeatherDataDTO implements WeatherData {
  @ApiProperty({ description: "Unix 時間戳", example: 1755066442 })
  unixTimestamp: number;

  @ApiProperty({ description: "當前溫度 (°C)", example: 30.95 })
  temperature: number;

  @ApiProperty({ description: "最高溫度 (°C)", example: 30.95 })
  maxTemperature: number;

  @ApiProperty({ description: "最低溫度 (°C)", example: 30.95 })
  minTemperature: number;

  @ApiProperty({ description: "體感溫度 (°C)", example: 34.99 })
  feelsLikeTemperature: number;

  @ApiProperty({ description: "濕度 (%)", example: 61 })
  humidity: number;

  @ApiProperty({ description: "能見度 (公尺)", example: 10000 })
  visibility: number;

  @ApiProperty({ description: "天氣描述", example: "陰，多雲" })
  weather: string;

  @ApiProperty({ description: "雲量 (%)", example: 98 })
  cloud: number;

  @ApiProperty({ description: "風速 (m/s)", example: 13.28 })
  windSpeed: number;

  @ApiProperty({ description: "過去1小時降雨量 (mm)", example: 0, required: false })
  rain?: number;

  @ApiProperty({ description: "過去1小時降雪量 (mm)", example: 0, required: false })
  snow?: number;

  @ApiProperty({ description: "天氣圖示代碼", example: "04d" })
  icon: string;
}

class CurrentWeatherDTO implements CurrentWeatherResponseDTO {
  @ApiProperty({ description: "國家代碼", example: "TW" })
  country: string;

  @ApiProperty({ description: "城市名稱", example: "Xianeibu" })
  city: string;

  @ApiProperty({ description: "天氣資料", type: CurrentWeatherDataDTO })
  data: CurrentWeatherDataDTO;
}

export { CoordinatesDTO, CurrentWeatherDTO, CurrentWeatherDataDTO };
