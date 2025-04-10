import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";
import { UserProfileDto } from "@/dtos/userProfile.dto.js";
import { UserProfile } from "@/entities/user_profile.entity.js";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileRepositoryManager: UserProfileRepositoryManager,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getUserProfile(userId: number): Promise<UserProfileDto> {
    const userProfile: UserProfile | null = await this.userProfileRepositoryManager.FindOneByIdwhitAll(userId);

    if (userProfile === null) throw new NotFoundException("用戶個人資料查詢失敗");

    const userProfileSettingDto: UserProfileDto = {
      motto: userProfile.motto,
      bio: userProfile.bio,
      fullname: userProfile.fullname,
      nickname: userProfile.nickname,
      isFullNameVisible: userProfile.isFullNameVisible,
      avatar: userProfile.avatar,
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

  async updateUserProfile(id: number, userProfileDto: UserProfileDto) {
    const userProfile: UserProfile | null = await this.userProfileRepositoryManager.FindOneByIdwhitAll(id);

    if (userProfile === null) throw new NotFoundException(`用戶:${id}個人資料查詢失敗`);

    return this.userProfileRepositoryManager.Save(userProfile);
  }
}
