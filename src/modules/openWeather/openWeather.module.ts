import { INJECTION_TOKEN } from "../../common/constants/constants.js";
import { OpenWeatherAsyncConfig } from "@/interfaces/openWeather.interface.js";
import { DynamicModule, Module } from "@nestjs/common";
import { OpenWeatherService } from "./openWeather.service.js";

//TODO:第三方功能要建立Logger紀錄
@Module({})
export class OpenWeatherModule {
  static forRootAsync(options: OpenWeatherAsyncConfig): DynamicModule {
    return {
      module: OpenWeatherModule,
      providers: [
        OpenWeatherService,
        {
          provide: INJECTION_TOKEN.OPENWEATHER_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      exports: [OpenWeatherService],
    };
  }
}
