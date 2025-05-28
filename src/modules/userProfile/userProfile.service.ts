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
import { Avatar } from "@/entities/avatar.entity.js";
import { AvatarChangeHistoryRepositoryManager } from "../../repositories/avatar_change_history.repository.js";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileRepositoryManager: UserProfileRepositoryManager,
    private readonly avatarChangeHistoryRepositoryManager: AvatarChangeHistoryRepositoryManager,
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
    const userProfile: UserProfile | null = await this.userProfileRepositoryManager.FindOneByIdwhitAll(userId);

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
   * 使用提供的數據更新用戶個人資料。
   *
   * @param id - 要更新的用戶個人資料的唯一標識符。
   * @param userProfileDto - 包含更新後用戶個人資料數據的對象。
   *
   * @returns 一個 Promise，解析為更新後的用戶個人資料實體。
   *
   * @throws {NotFoundException} 如果找不到具有指定 ID 的用戶個人資料。
   *
   * @remarks
   * 此方法在數據庫事務中執行更新操作，以確保數據一致性。
   * 它更新用戶個人資料的各個字段，包括個人詳細信息、可見性設置，
   * 以及與國家、語言、貨幣、旅行興趣和旅行風格等相關的實體。
   */
  async updateUserProfile(id: number, userProfileDto: UserProfileDto) {
    return await this.dataSource.transaction(async (manager) => {
      const userProfile: UserProfile | null = await this.userProfileRepositoryManager.FindOneByIdwhitAllInTransaction(id, manager);

      if (userProfile === null) throw new NotFoundException(`用戶:${id}個人資料查詢失敗`);

      userProfile.motto = userProfileDto.motto;
      userProfile.bio = userProfileDto.bio;
      userProfile.fullname = userProfileDto.fullname;
      userProfile.nickname = userProfileDto.nickname;
      userProfile.isFullNameVisible = userProfileDto.isFullNameVisible ?? false;

      // 更新頭像
      const avatarEntity = mapIdsToEntities<Avatar>(userProfileDto.avatar.id);
      if (!avatarEntity) throw new NotFoundException("找不到對應的頭像");
      if (userProfile.avatar.id !== avatarEntity.id) {
        await this.avatarChangeHistoryRepositoryManager.SaveInTransaction(
          this.avatarChangeHistoryRepositoryManager.New(userProfile.user.id, userProfile.avatar.id),
          manager,
        );
      }
      userProfile.avatar = avatarEntity;

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

      return this.mapUserProfileToDto(userProfile);
    });
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
