import { DatabaseException } from "../common/exception/database.exception.js";
import { AvatarChangeHistory } from "../entities/avatar_change_history.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, TypeORMError } from "typeorm";

@Injectable()
export class AvatarChangeHistoryRepositoryManager {
  constructor(
    @InjectRepository(AvatarChangeHistory)
    private readonly avatarChangeHistoryRepository: Repository<AvatarChangeHistory>,
  ) {}

  /**
   * 依據用戶設定檔 id 取得多個頭像歷史
   * @param userProfileId 用戶設定檔 id
   * @returns AvatarChangeHistory[]
   *
   * 從資料庫中獲取多個頭像歷史，並按照最後修改時間排序
   */
  async FindManyByUserProfileId(userProfileId: number): Promise<AvatarChangeHistory[]> {
    return await this.avatarChangeHistoryRepository
      .find({
        where: { user_profile_id: userProfileId },
      })
      .then((result) => result.sort((a, b) => b.change_date.getTime() - a.change_date.getTime()));
  }

  /**
   * 儲存用戶頭像歷史
   * @param avatarChangeHistory 頭像歷史實體
   * @returns 儲存的頭像歷史實體
   *
   * 將頭像歷史實體儲存到資料庫
   */
  async Save(avatarChangeHistory: AvatarChangeHistory): Promise<AvatarChangeHistory> {
    try {
      return await this.avatarChangeHistoryRepository.save(avatarChangeHistory);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new DatabaseException("資料庫發生錯誤,請稍後再試", error);
      } else {
        throw error;
      }
    }
  }

  /**
   * 在給定的交易中使用提供的 `EntityManager` 儲存 `AvatarChangeHistory` 實體。
   *
   * @param avatarChangeHistory - 要儲存的 `AvatarChangeHistory` 實體。
   * @param manager - 用於管理交易的 `EntityManager` 實例。
   * @returns 一個 Promise，解析為已儲存的 `AvatarChangeHistory` 實體。
   * @throws DatabaseException - 如果在儲存操作期間發生 `TypeORMError`。
   * @throws Error - 如果發生意外錯誤。
   */

  async SaveInTransaction(avatarChangeHistory: AvatarChangeHistory, manager: EntityManager): Promise<AvatarChangeHistory> {
    try {
      return await manager.save(avatarChangeHistory);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new DatabaseException("資料庫錯誤", error);
      } else {
        throw error;
      }
    }
  }

  /**
   * 創建一個新的 `AvatarChangeHistory` 實體
   * @param userId - 用戶設定檔 id
   * @param avatarId - 頭像 id
   * @returns 創建的 `AvatarChangeHistory` 實體
   */
  New(userId: number, avatarId: number): AvatarChangeHistory {
    return this.avatarChangeHistoryRepository.create({ user_profile_id: userId, avatar_id: avatarId });
  }
}
