import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserProfileDto } from "@/dtos/userProfile.dto.js";
import { UserProfile } from "@/entities/user_profile.entity.js";
import { Country } from "@/entities/country.entity.js";
import { Language } from "@/entities/language.entity.js";
import { Currency } from "@/entities/currency.entity.js";
import { TravelInterest } from "@/entities/travel_interest.entity.js";
import { TravelStyle } from "@/entities/travel_style.entity.js";
import { DataSource } from "typeorm";
import { mapIdsToEntities } from "../../common/utils/entity.utils.js";
import { AvatarChangeHistoryRepositoryManager } from "../../repositories/avatar_change_history.repository.js";
import { AvatarChangeHistory } from "@/entities/avatar_change_history.entity.js";
import AvatarChangeHistoryDTO from "@/dtos/avatarChangeHistory.dto.js";
import AvatarService from "../avatar/avatar.service.js";
import AvatarDTO from "@/dtos/avatar.dto.js";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileRepositoryManager: UserProfileRepositoryManager,
    private readonly avatarChangeHistoryRepositoryManager: AvatarChangeHistoryRepositoryManager,
    private readonly avatarService: AvatarService,
    private readonly dataSource: DataSource,
  ) {}

  New(nickname: string): UserProfile {
    return this.userProfileRepositoryManager.New(nickname);
  }

  /**
   * 根據用戶 ID 獲取用戶個人資料。
   *
   * @param userId - 要查詢的用戶唯一標識符。
   * @returns 一個 Promise，解析為包含用戶個人資料詳細信息的 `UserProfileDto`。
   * @throws {NotFoundException} 如果找不到用戶個人資料。
   */
  async getUserProfile(userId: number): Promise<UserProfileDto> {
    const userProfile: UserProfile | null = await this.userProfileRepositoryManager.FindOneByUserIdwhitAll(userId);

    if (userProfile === null) throw new NotFoundException("用戶個人資料查詢失敗");

    const userProfileSettingDto: UserProfileDto = {
      motto: userProfile.motto,
      bio: userProfile.bio,
      fullname: userProfile.fullname,
      nickname: userProfile.nickname,
      isFullNameVisible: userProfile.isFullNameVisible,
      avatar: {
        id: userProfile.avatar.id,
        public_id: userProfile.avatar.public_id,
        type: userProfile.avatar.type,
        create_at: userProfile.avatar.createAt,
      },
      coverPhoto: userProfile.coverPhoto,
      birthday: userProfile.birthday,
      phone: userProfile.phone,
      gender: userProfile.gender,
      address: userProfile.address,
      originCountry: userProfile.originCountry?.id,
      visitedCountries: userProfile.visitedCountries?.map((country) => country.id),
      languages: userProfile.languages?.map((language) => language.id),
      currencies: userProfile.currencies?.map((currency) => currency.id),
      travelInterests: userProfile.travelInterests?.map((interest) => interest.id),
      travelStyles: userProfile.travelStyles?.map((style) => style.id),
      user: {
        account: userProfile.user.account,
        email: userProfile.user.email,
        createAt: userProfile.user.createAt,
      },
    };

    return userProfileSettingDto;
  }

  /**
   * 依據用戶 ID 和 UserProfileDTO 更新用戶個人資料
   *
   * @param userId - 要更新的用戶唯一標識符
   * @param userProfileDto - 要更新的用戶個人資料
   * @returns 一個 Promise，解析為包含更新後用戶個人資料的 `UserProfileDto`
   * @throws {NotFoundException} 如果找不到用戶個人資料
   */
  async updateUserProfile(userId: number, userProfileDto: UserProfileDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userProfile: UserProfile | null = await this.userProfileRepositoryManager.FindOneByUserIdwithAllInTransaction(userId, manager);

      if (userProfile === null) throw new NotFoundException(`用戶:${userId}個人資料查詢失敗`);

      userProfile.motto = userProfileDto.motto;
      userProfile.bio = userProfileDto.bio;
      userProfile.fullname = userProfileDto.fullname;
      userProfile.nickname = userProfileDto.nickname;
      userProfile.isFullNameVisible = userProfileDto.isFullNameVisible ?? false;
      userProfile.coverPhoto = userProfileDto.coverPhoto;
      userProfile.birthday = userProfileDto.birthday;
      userProfile.gender = userProfileDto.gender;
      userProfile.phone = userProfileDto.phone;
      userProfile.address = userProfileDto.address;

      userProfile.originCountry = mapIdsToEntities<Country>(userProfileDto.originCountry);
      userProfile.visitedCountries = mapIdsToEntities<Country>(userProfileDto.visitedCountries);
      userProfile.languages = mapIdsToEntities<Language>(userProfileDto.languages);
      userProfile.currencies = mapIdsToEntities<Currency>(userProfileDto.currencies);
      userProfile.travelInterests = mapIdsToEntities<TravelInterest>(userProfileDto.travelInterests);
      userProfile.travelStyles = mapIdsToEntities<TravelStyle>(userProfileDto.travelStyles);

      await this.userProfileRepositoryManager.SaveInTransaction(userProfile, manager);
      const userProfileAfterSave = await this.userProfileRepositoryManager.FindOneByUserIdwithAllInTransaction(userId, manager);

      if (userProfileAfterSave === null) throw new NotFoundException(`用戶:${userId}個人資料查詢失敗`);

      return this.mapUserProfileToDto(userProfileAfterSave);
    });
  }

  /**
   * 更新用戶頭像
   *
   * @param userId - 要更新的用戶唯一標識符
   * @param avatarId - 新的頭像 id
   * @returns 一個 Promise，解析為包含更新後用戶頭像詳細信息的 `AvatarDTO`
   *
   * @throws {NotFoundException} 如果找不到用戶個人資料
   * @throws {NotFoundException} 如果找不到用戶頭像
   *
   * @remarks
   * 這個方法在數據庫事務中執行更新操作，以確保數據一致性
   * 它首先檢查用戶是否存在，如果不存在則拋出異常
   * 然後检查頭像是否存在，如果不存在則拋出異常
   * 最後，它將用戶頭像更新為新的頭像，並將更新的頭像詳細信息返回
   */
  async updateAvatar(userId: number, avatarId: number): Promise<AvatarDTO> {
    if (avatarId <= 0) throw new NotFoundException(`無效的頭像 ID`);

    return await this.dataSource.transaction(async (manager) => {
      const userProfile = await this.userProfileRepositoryManager.FindOneByUserIdwithAllInTransaction(userId, manager);
      if (!userProfile) throw new NotFoundException(`用戶:${userId}個人資料查詢失敗`);
      if (avatarId === userProfile.avatar?.id) {
        return {
          id: userProfile.avatar.id,
          public_id: userProfile.avatar.public_id,
          type: userProfile.avatar.type,
          create_at: userProfile.avatar.createAt,
        };
      }

      const avatar = await this.avatarService.getAvatarByIdInTransaction(avatarId, manager);
      if (!avatar) {
        throw new NotFoundException(`Avatar ${avatarId} 不存在`);
      }

      const avatarChangeHistory = this.NewAvatarChangeHistory(userId, avatarId);

      userProfile.avatar = avatar;

      await this.avatarChangeHistoryRepositoryManager.SaveInTransaction(avatarChangeHistory, manager);
      await this.userProfileRepositoryManager.SaveInTransaction(userProfile, manager);

      return {
        id: avatar.id,
        public_id: avatar.public_id,
        type: avatar.type,
        create_at: avatar.createAt,
      };
    });
  }

  /**
   * 獲取用戶頭像變更歷史
   * @param userId - 要查詢的用戶唯一標識符
   * @returns 一個 Promise，解析為包含用戶頭像變更歷史的 `AvatarChangeHistoryDTO` 陣列
   * @throws {NotFoundException} 如果找不到用戶個人資料
   */
  async getChangeHistoryAvatar(userId: number): Promise<AvatarChangeHistoryDTO[]> {
    const userProfile = await this.userProfileRepositoryManager.FindOneByUserIdwhitAll(userId);
    if (userProfile === null) throw new NotFoundException(`用戶:${userId}個人資料查詢失敗`);

    const avatarChangeHistory = await this.avatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar(userProfile.id);
    const avatars: AvatarChangeHistoryDTO[] = avatarChangeHistory.map((item) => {
      return {
        id: item.avatar.id,
        avatar: {
          id: item.avatar.id,
          public_id: item.avatar.public_id,
          type: item.avatar.type,
          create_at: item.avatar.createAt,
        },
        change_date: item.change_date,
      };
    });

    return avatars;
  }

  NewAvatarChangeHistory(userId: number, avatarId: number): AvatarChangeHistory {
    return this.avatarChangeHistoryRepositoryManager.New(userId, avatarId);
  }

  private mapUserProfileToDto(entity: UserProfile): UserProfileDto {
    return {
      motto: entity.motto,
      bio: entity.bio,
      fullname: entity.fullname,
      nickname: entity.nickname,
      isFullNameVisible: entity.isFullNameVisible,
      avatar: {
        id: entity.avatar.id,
        public_id: entity.avatar.public_id,
        type: entity.avatar.type,
        create_at: entity.avatar.createAt,
      },
      coverPhoto: entity.coverPhoto,
      birthday: entity.birthday,
      phone: entity.phone,
      gender: entity.gender,
      address: entity.address,
      originCountry: entity.originCountry?.id,
      visitedCountries: entity.visitedCountries?.map((country) => country.id) || [],
      languages: entity.languages?.map((language) => language.id) || [],
      currencies: entity.currencies?.map((currency) => currency.id) || [],
      travelInterests: entity.travelInterests?.map((interest) => interest.id) || [],
      travelStyles: entity.travelStyles?.map((style) => style.id) || [],
      user: {
        account: entity.user.account,
        email: entity.user.email,
        createAt: entity.user.createAt,
      },
    };
  }
}
