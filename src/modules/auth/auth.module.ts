import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { Module } from '@nestjs/common';
import { UserProfile } from '../../entities/user_profiles.entity.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStaregy } from '../../common/strategies/jwt.strategy.js';
import { UserRepository } from '../../repositories/user.repository.js';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserProfile]),
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],

            useFactory: (ConfigService: ConfigService) => ({
                secret: ConfigService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: ConfigService.get('JWT_EXPIRES_IN'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStaregy, UserRepository],
})
export class AuthModule {}
