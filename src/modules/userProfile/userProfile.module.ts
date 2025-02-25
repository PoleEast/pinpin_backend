import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { Module } from "@nestjs/common";
import { UserProfile } from "../../entities/user_profile.entity.js";
import { User } from "../../entities/user.entity.js";
import { CloudinaryModule } from "../cloudinary/cloudinary.module.js";
import { UserProfileService } from "./userProfile.service.js";
import { ConfigService } from "@nestjs/config";
import { UserProfileController } from "./userProfile.controller.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    CloudinaryModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        cloud_name: configService.get("CLOUDINARY_NAME"),
        api_key: configService.get("CLOUDINARY_API_KEY"),
        api_secret: configService.get("CLOUDINARY_API_SECRET"),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserProfileController],
  providers: [
    UserProfileService,
    UserRepositoryManager,
    UserProfileRepositoryManager,
  ],
  exports: [UserRepositoryManager, UserProfileRepositoryManager],
})
export class UserProfileModule {}
