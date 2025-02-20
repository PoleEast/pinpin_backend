import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStaregy } from "../../common/strategies/jwt.strategy.js";
import { ConfigService } from "@nestjs/config";
import { UserProfileModule } from "../userProfile/userProfile.module.js";

@Module({
  imports: [
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
  providers: [UserService, JwtStaregy],
})
export class UserModule {}
