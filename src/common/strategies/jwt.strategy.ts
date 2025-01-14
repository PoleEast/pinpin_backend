import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtconfig } from 'src/configs/jwt.config';

@Injectable()
export class JwtStaregy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtconfig.secret,
        });
    }

    async validate(payload: any) {
        return { account: payload.account, id: payload.id };
    }
}
