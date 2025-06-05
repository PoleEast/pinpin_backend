import { DatabaseException } from "../common/exception/database.exception.js";
import { Avatar } from "../entities/avatar.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository, TypeORMError } from "typeorm";

@Injectable()
export class AvatarRepositoryManager {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  /**
   * 依據用戶 id 取得用戶的所有頭像
   * @param userId 用戶id
   * @returns Avatar[]
   */
  async FindManyByUserId(userId: number): Promise<Avatar[]> {
    return await this.avatarRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /**
   * 取得所有預設頭像。
   *
   * @returns 包含所有預設頭像的陣列。
   */

  async FindAllDefault(): Promise<Avatar[]> {
    return await this.avatarRepository.find({
      where: {
        type: 1,
      },
    });
  }

  /**
   * 依據 id 取得頭像
   * @param id 頭像id
   * @returns 頭像實體，或者如果找不到則為 null
   */
  async FindOneById(id: number): Promise<Avatar | null> {
    return await this.avatarRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * 在交易中根據 id 取得頭像
   * @param id - 頭像id
   * @param manager - 用於在交易中執行資料庫操作的 `EntityManager` 實例
   * @returns 頭像實體，或者如果找不到則為 null
   */
  async FindOneByIdInTransaction(id: number, manager: EntityManager): Promise<Avatar | null> {
    return await manager.getRepository(Avatar).findOne({
      where: {
        id: id,
      },
    });
  }

  /**
   * 儲存用戶頭像
   *
   * @param avatar - 頭像實體
   * @returns 儲存的頭像實體
   * @throws DatabaseException - 如果在儲存操作期間發生資料庫錯誤
   * @throws Error - 如果發生意外錯誤
   */
  async Save(avatar: Avatar): Promise<Avatar> {
    try {
      return await this.avatarRepository.save(avatar);
    } catch (error) {
      if (error instanceof TypeORMError) {
        throw new DatabaseException("資料庫發生錯誤,請稍後再試", error);
      } else {
        throw error;
      }
    }
  }

  New(avatar: Partial<Avatar>): Avatar {
    return this.avatarRepository.create(avatar);
  }
}
