import { JwtStrategy } from "../../common/strategies/jwt.strategy.js";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module.js";

@Module({
  imports: [UserModule],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
