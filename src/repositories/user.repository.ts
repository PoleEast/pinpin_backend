import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseException } from "../common/exception/database.exception.js";
import { User } from "../entities/user.entity.js";
import { Repository, TypeORMError } from "typeorm";
import { UserProfile } from "@/entities/user_profile.entity.js";

@Injectable()
export class UserRepositoryManager {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //#region 查詢

  /**
   * 依據帳號取得一位用戶
   * @param account 帳號
   * @returns User | null
   */
  async FindOneByAccount(account: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { account: account },
    });
  }

  /**
   * 依據帳號取得一位用戶，包含profile
   * @param account 帳號
   * @returns User | null
   */
  async FindOneByAccountWithProfile(account: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { account: account },
      relations: {
        profile: true,
      },
    });
  }

  /**
   * 依據 id 取得一位用戶
   * @param id 用戶id
   * @returns User | null
   */
  async FindOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  /**
   * 依據 id 取得一位用戶，包含profile
   * @param id 用戶id
   * @returns User | null
   */
  async FindOneByIdWithProfile(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: {
        profile: true,
      },
    });
  }

  //#endregion

  //#region 更新

  /**
   * 更新用戶
   * @param user 會包含user的profile
   * @returns 更新的用戶
   */
  async Save(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new DatabaseException("資料庫發生錯誤,請稍後再試", error);
      } else {
        throw error;
      }
    }
  }

  //#endregion

  New(account: string, password_hash: string, profile: UserProfile): User {
    return this.userRepository.create({
      account: account,
      password_hash: password_hash,
      profile: profile,
    });
  }
}
