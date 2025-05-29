import { User } from "@/entities/user.entity.js";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { JwtPayload } from "../../interfaces/jwt.interface.js";

@Injectable()
export class JwtStaregy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configservice: ConfigService,
    private userRepositoryManager: UserRepositoryManager,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        //使用cookie儲存token與REST風格不符所以需要手動操作
        return req.cookies?.access_token || null;
      },
      ignoreExpiration: false,
      secretOrKey: configservice.get("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<User | null> {
    const { id } = payload;
    return await this.userRepositoryManager.FindOneByIdWithProfileWhitAvatar(id);
  }
}
