import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {
    LoginDto,
    LoginServiceDto,
    RegisterDto,
    RegisterServiceDto,
} from '../../dtos/auth.dto.js';
import { User } from '../../entities/user.entity.js';
import * as bcrypt from 'bcrypt';
import { UserProfile } from '../../entities/user_profiles.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../repositories/user.repository.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 註冊用戶
     *
     * @param registerDto 註冊資訊
     */
    async Register(registerDto: RegisterDto): Promise<RegisterServiceDto> {
        // 檢查帳號是否已經存在
        if (await this.userRepository.FindUser(registerDto.account)) {
            throw new ConflictException('帳號已經存在');
        }

        //整理使用者資料
        const userProfile = new UserProfile();
        userProfile.nickname = registerDto.nickname;

        const user = new User();
        user.account = registerDto.account;
        user.password_hash = this.getHashPassword(registerDto.password);
        user.profile = userProfile;

        // 建立用戶
        const createdUser = await this.userRepository.CreateUser(user);
        const registerServiceDto: RegisterServiceDto = {
            token: this.generateToken(createdUser),
            account: createdUser.account,
            nickname: createdUser.profile.nickname,
        };

        return registerServiceDto;
    }

    async Login(loginDto: LoginDto): Promise<LoginServiceDto> {
        const user = await this.userRepository.FindUser(loginDto.account);
        if (!user) {
            throw new UnauthorizedException('帳號或密碼錯誤');
        }

        //比對密碼是否正確(compareSync會將第一個參數加密後和第二個參數進行比對)
        if (!bcrypt.compareSync(loginDto.password, user.password_hash)) {
            throw new UnauthorizedException('帳號或密碼錯誤');
        }

        //回傳token和使用者資料
        const loginServiceDto: LoginServiceDto = {
            token: this.generateToken(user),
            account: user.account,
            nickname: user.profile.nickname,
        };

        return loginServiceDto;
    }

    //TODO: 第二版預定實作refresh token
    private generateToken(user: User): string {
        const payload = {
            username: user.account,
            id: user.id,
        };

        const jwtToken = this.jwtService.sign(payload);

        return jwtToken;
    }

    /**
     * 將密碼轉換為雜湊值
     * @param password 明文密碼
     * @returns 雜湊後的密碼
     */
    private getHashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
}
