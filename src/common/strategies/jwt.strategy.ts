import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStaregy extends PassportStrategy(Strategy) {
    constructor(private readonly configservice: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configservice.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        return { account: payload.account, id: payload.id };
    }
}
