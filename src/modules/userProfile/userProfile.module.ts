import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { Module } from "@nestjs/common";
import { UserProfile } from "../../entities/user_profile.entity.js";
import { User } from "../../entities/user.entity.js";
import { UserProfileService } from "./userProfile.service.js";
import { UserProfileController } from "./userProfile.controller.js";
import { Avatar } from "../../entities/avatar.entity.js";
import { AvatarChangeHistoryRepositoryManager } from "../../repositories/avatar_change_history.repository.js";
import { AvatarChangeHistory } from "../../entities/avatar_change_history.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile, Avatar, AvatarChangeHistory])],
  controllers: [UserProfileController],
  providers: [UserProfileService, UserProfileRepositoryManager, AvatarChangeHistoryRepositoryManager],
  exports: [UserProfileService],
})
export class UserProfileModule {}
