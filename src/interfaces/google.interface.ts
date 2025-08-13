import { InjectionToken } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface GoogleAsyncConfig {
  useFactory: (configService: ConfigService) => Promise<ConfigOptions> | ConfigOptions;
  inject?: InjectionToken[];
}

interface ConfigOptions {
  apiKey?: string;
}

export type { GoogleAsyncConfig, ConfigOptions };
