import { UserRepositoryManager } from '../../repositories/user.repository.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStaregy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configservice: ConfigService,
        private userRepositoryManager: UserRepositoryManager,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configservice.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const { id } = payload;
        return await this.userRepositoryManager.FindOneByAccount(id);
    }
}

