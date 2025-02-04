import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseException } from '../common/exception/database.exception.js';
import { User } from '../entities/user.entity.js';
import { DataSource, FindOneOptions, Repository, TypeORMError } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) {}

    /**
     * 取得一位用戶
     * @param account 用戶帳號
     */
    async FindUser(account: string): Promise<User | null> {
        const findOptions: FindOneOptions = {
            where: { account: account },
        };
        return await this.userRepository.findOne(findOptions);
    }

    /**
     * 建立用戶
     * @param user 會包含user的profile
     * @returns 建立的用戶
     */
    async CreateUser(user: User): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            return user;
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
}
