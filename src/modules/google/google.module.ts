import { INJECTION_TOKEN } from "../../common/constants/constants.js";
import { GoogleAsyncConfig } from "@/interfaces/google.interface.js";
import { DynamicModule, Module } from "@nestjs/common";
import { GoogleService } from "./google.service.js";

//TODO:第三方功能要建立Logger紀錄
@Module({})
export class GoogleModule {
  static forRootAsync(options: GoogleAsyncConfig): DynamicModule {
    return {
      module: GoogleModule,
      providers: [
        GoogleService,
        {
          provide: INJECTION_TOKEN.GOOGLE_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      exports: [GoogleService],
    };
  }
}
