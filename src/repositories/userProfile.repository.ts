import { DatabaseException } from "../common/exception/database.exception.js";
import { UserProfile } from "../entities/user_profile.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TypeORMError } from "typeorm";

@Injectable()
export class UserProfileRepositoryManager {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  //#region 查詢

  /**
   * 依據 id 取得一位用戶，包含所有資料
   * @param id 用戶id
   * @returns UserProfile | null
   */
  async FindOneByIdwhitAll(id: number): Promise<UserProfile | null> {
    return await this.userProfileRepository.findOne({
      where: { id: id },
      relations: {
        originCountry: true,
        visitedCountries: true,
        languages: true,
        currencies: true,
        travelInterests: true,
        travelStyles: true,
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

  //#endregion

  New(nickname: string): UserProfile {
    return this.userProfileRepository.create({
      nickname: nickname,
    });
  }
}
