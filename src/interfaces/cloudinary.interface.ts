import { InjectionToken } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface CloudinaryConfig {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
}

interface CloudinaryAsyncConfig {
  useFactory: (
    configService: ConfigService,
  ) => Promise<CloudinaryConfig> | CloudinaryConfig;
  inject?: InjectionToken[];
}

export type { CloudinaryConfig, CloudinaryAsyncConfig };
