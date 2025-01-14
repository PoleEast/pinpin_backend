import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UserProfile } from 'src/entities/user_profiles.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtconfig } from 'src/configs/jwt.config';
import { JwtStaregy } from 'src/common/strategies/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserProfile]),
        PassportModule,
        JwtModule.register({
            secret: jwtconfig.secret,
            signOptions: { expiresIn: jwtconfig.expiresIn },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStaregy],
})
export class AuthModule {}
