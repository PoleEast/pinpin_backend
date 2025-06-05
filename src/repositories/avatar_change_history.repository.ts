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
   * 依據用戶設定檔 ID 獲取用戶頭像變更歷史
   * @param userProfileId - 用戶設定檔 ID
   * @returns 依據用戶設定檔 ID 獲得的頭像變更歷史
   *
   * 使用 TypeORM 的 QueryBuilder 來查詢用戶頭像變更歷史
   * 首先，它會使用 Left Join 來取得用戶頭像
   * 接著，它會使用 Subquery 來取得每個頭像的最新變更日期
   * 最後，它會使用 OrderBy 來將結果按照變更日期排序
   */
  async FindManyByUserProfileIdWithAvatar(userProfileId: number): Promise<AvatarChangeHistory[]> {
    return await this.avatarChangeHistoryRepository
      .createQueryBuilder("history")
      .leftJoinAndSelect("history.avatar", "avatar")
      .where("history.user_profile_id = :userProfileId", { userProfileId })
      .andWhere(
        `history.change_date = (
      SELECT MAX(h2.change_date) 
      FROM avatar_change_history h2 
      WHERE h2.user_profile_id = history.user_profile_id 
      AND h2.avatar_id = history.avatar_id
    )`,
      )
      .orderBy("history.change_date", "DESC")
      .getMany();
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
    return this.avatarChangeHistoryRepository.create({ user_profile: { id: userId }, avatar: { id: avatarId } });
  }
}
