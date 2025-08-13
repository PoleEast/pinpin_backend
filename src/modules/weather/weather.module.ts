import { Module } from "@nestjs/common";
import { OpenWeatherModule } from "../openWeather/openWeather.module.js";
import { ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { ThrottlerModule } from "@nestjs/throttler";
import { WeatherController } from "./weather.controller.js";
import { WeatherService } from "./weather.service.js";

//TODO:統一整個專案的throttle配置管理，避免不同模組間的限流設定不一致

@Module({
  imports: [
    OpenWeatherModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get("OPENWEATHER_API_KEY"),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
