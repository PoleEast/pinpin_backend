import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStaregy } from "../../common/strategies/jwt.strategy.js";
import { ConfigService } from "@nestjs/config";
import { UserProfileModule } from "../userProfile/userProfile.module.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity.js";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { AvatarModule } from "../avatar/avatar.module.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AvatarModule,
    UserProfileModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStaregy, UserRepositoryManager],
})
export class UserModule {}
