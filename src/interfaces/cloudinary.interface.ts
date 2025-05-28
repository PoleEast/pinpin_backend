import { InjectionToken } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigOptions } from "cloudinary";

interface CloudinaryAsyncConfig {
  useFactory: (configService: ConfigService) => Promise<ConfigOptions> | ConfigOptions;
  inject?: InjectionToken[];
}

export type { CloudinaryAsyncConfig };
