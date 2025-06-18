import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { GoogleModule } from "../google/google.module.js";
import { ConfigService } from "@nestjs/config";
import { SearchLocationController } from "./searchLocation.controller.js";
import { SearchLocationService } from "./searchLocation.service.js";
import { ThrottlerModule } from "@nestjs/throttler";
@Module({
  imports: [
    GoogleModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get("GOOGLE_API_KEY"),
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 1,
        },
      ],
    }),
  ],
  controllers: [SearchLocationController],
  providers: [SearchLocationService],
  exports: [],
})
export class SearchLocationModule {}
