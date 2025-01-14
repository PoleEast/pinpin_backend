import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto, RegisterServiceDto } from 'src/dtos/auth.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserProfile } from 'src/entities/user_profiles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository, TypeORMError } from 'typeorm';
import { DatabaseException } from 'src/common/exception/database.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private dataSource: DataSource,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * 註冊用戶
     *
     * @param registerDto 註冊資訊
     */
    async register(registerDto: RegisterDto): Promise<RegisterServiceDto> {
        // 檢查帳號是否已經存在
        const findOptions: FindOneOptions = {
            where: { account: registerDto.account },
        };
        const existingUser = await this.userRepository.findOne(findOptions);
        if (existingUser) {
            throw new ConflictException('帳號已經存在');
        }

        // 加密密碼
        const hashPassword = await bcrypt.hash(registerDto.password, 10);

        // 建立用戶
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userProfile = new UserProfile();
            userProfile.nickname = registerDto.nickname;

            const user = new User();
            user.account = registerDto.account;
            user.password_hash = hashPassword;
            user.profile = userProfile;

            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();

            const registerServiceDto: RegisterServiceDto = {
                token: this.generateToken(user),
                account: user.account,
                nickname: user.profile.nickname,
            };

            return registerServiceDto;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof TypeORMError) {
                throw new DatabaseException('資料庫發生錯誤,請稍後再試', error);
            } else {
                throw error;
            }
        } finally {
            await queryRunner.release();
        }
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
}
