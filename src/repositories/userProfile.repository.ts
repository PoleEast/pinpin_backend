import { UserProfile } from "../entities/user_profile.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
        origin_country: true,
        visited_countries: true,
        languages: true,
        currencies: true,
        travel_interests: true,
        travel_styles: true,
        user: true,
      },
    });
  }

  //#endregion

  New(nickname: string): UserProfile {
    return this.userProfileRepository.create({
      nickname: nickname,
    });
  }
}
