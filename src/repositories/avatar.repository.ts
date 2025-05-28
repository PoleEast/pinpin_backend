import { DatabaseException } from "../common/exception/database.exception.js";
import { Avatar } from "../entities/avatar.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TypeORMError } from "typeorm";

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
