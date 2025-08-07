import { DatabaseException } from "../common/exception/database.exception.js";
import { UserProfile } from "../entities/user_profile.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, TypeORMError } from "typeorm";

@Injectable()
export class UserProfileRepositoryManager {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  //#region 查詢

  /**
   * 依據用戶 ID 取得用戶個人資料
   * @param userId - 用戶 ID
   * @returns UserProfile | null
   * @throws {DatabaseException} - 如果出現資料庫錯誤
   */
  async FindOneByUserIdwhitAll(userId: number): Promise<UserProfile | null> {
    return await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        originCountry: true,
        visitedCountries: true,
        languages: true,
        currencies: true,
        travelInterests: true,
        travelStyles: true,
        user: true,
        avatar: true,
      },
    });
  }

  /**
   * 在交易中根據 userId 取得用戶，包含所有資料
   * @param userId - 用戶id
   * @param manager - 用於在交易中執行資料庫操作的 `EntityManager` 實例
   * @returns UserProfile | null
   */
  async FindOneByUserIdwithAllInTransaction(userId: number, manager: EntityManager) {
    return await manager.findOne(UserProfile, {
      where: { user: { id: userId } },
      relations: {
        originCountry: true,
        visitedCountries: true,
        languages: true,
        currencies: true,
        travelInterests: true,
        travelStyles: true,
        avatar: true,
        user: true,
      },
    });
  }

  //#endregion

  //#region 新增

  /**
   * 將用戶資料儲存到資料庫。
   *
   * @param userProfile - 要儲存的用戶資料實體。
   * @returns 一個 Promise，解析為已儲存的用戶資料實體。
   * @throws DatabaseException - 如果在儲存操作期間發生資料庫錯誤。
   * @throws Error - 如果發生意外錯誤。
   */
  async Save(userProfile: UserProfile): Promise<UserProfile> {
    try {
      return await this.userProfileRepository.save(userProfile);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new DatabaseException("資料庫錯誤", error);
      } else {
        throw error;
      }
    }
  }

  /**
   * 在給定的交易中使用提供的 `EntityManager` 儲存 `UserProfile` 實體。
   *
   * @param userProfile - 要儲存的 `UserProfile` 實體。
   * @param manager - 用於管理交易的 `EntityManager` 實例。
   * @returns 一個 Promise，解析為已儲存的 `UserProfile` 實體。
   * @throws DatabaseException - 如果在儲存操作期間發生 `TypeORMError`。
   * @throws Error - 如果發生意外錯誤。
   */
  async SaveInTransaction(userProfile: UserProfile, manager: EntityManager): Promise<UserProfile> {
    try {
      return await manager.save(userProfile);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new DatabaseException("資料庫錯誤", error);
      } else {
        throw error;
      }
    }
  }

  //#endregion

  New(nickname: string): UserProfile {
    return this.userProfileRepository.create({
      nickname: nickname,
      avatar_changed_history: [],
    });
  }
}
