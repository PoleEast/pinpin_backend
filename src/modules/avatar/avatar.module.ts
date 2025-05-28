import { Avatar } from "../../entities/avatar.entity.js";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudinaryModule } from "../cloudinary/cloudinary.module.js";
import { ConfigService } from "@nestjs/config";
import { AvatarController } from "./avatar.controller.js";
import { AvatarService } from "./avatar.service.js";
import { AvatarRepositoryManager } from "../../repositories/avatar.repository.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([Avatar]),
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get("CLOUDINARY_NAME"),
        api_key: configService.get("CLOUDINARY_API_KEY"),
        api_secret: configService.get("CLOUDINARY_API_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AvatarController],
  providers: [AvatarService, AvatarRepositoryManager],
  exports: [AvatarService],
})
export class AvatarModule {}
