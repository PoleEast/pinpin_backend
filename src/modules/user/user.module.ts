import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { Module } from "@nestjs/common";
import { UserProfileModule } from "../userProfile/userProfile.module.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity.js";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { AvatarModule } from "../avatar/avatar.module.js";
@Module({
  imports: [TypeOrmModule.forFeature([User]), AvatarModule, UserProfileModule],
  controllers: [UserController],
  providers: [UserService, UserRepositoryManager],
  exports: [UserService],
})
export class UserModule {}
