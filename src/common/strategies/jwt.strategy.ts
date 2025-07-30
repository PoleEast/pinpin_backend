import { User } from "@/entities/user.entity.js";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { JwtPayload } from "../../interfaces/jwt.interface.js";
import { UserService } from "../../modules/user/user.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        //使用cookie儲存token與REST風格不符所以需要手動操作
        return req.cookies?.access_token || null;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    const { id } = payload;
    return await this.userService.getUserByIdWithProfileWhitAvatar(id);
  }
}
