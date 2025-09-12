import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { Coordinates, COORDINATES_VALIDATION, TIME_OF_DAY_VALIDATION, TimeOfDay, WeatherRequest } from "pinpin_library";

class CoordinatesDto implements Coordinates, WeatherRequest {
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

class TimeOfDayDto implements TimeOfDay {
  @ApiProperty({ description: "小時", example: 14, minimum: 0, maximum: 23 })
  @IsNumber()
  @Min(TIME_OF_DAY_VALIDATION.HOUR.MIN)
  @Max(TIME_OF_DAY_VALIDATION.HOUR.MAX)
  @Transform(({ value }) => parseInt(value))
  hour: number;

  @ApiProperty({ description: "分鐘", example: 30, minimum: 0, maximum: 59 })
  @IsNumber()
  @Min(TIME_OF_DAY_VALIDATION.MINUTE.MIN)
  @Max(TIME_OF_DAY_VALIDATION.MINUTE.MAX)
  @Transform(({ value }) => parseInt(value))
  minute: number;
}

export { CoordinatesDto, TimeOfDayDto };
