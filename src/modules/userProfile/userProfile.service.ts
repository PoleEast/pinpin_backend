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
    const userProfile: UserProfile | null =
      await this.userProfileRepositoryManager.FindOneByIdwhitAll(userId);

    if (userProfile === null)
      throw new NotFoundException("用戶個人資料查詢失敗");

    const userProfileSettingDto: UserProfileDto = {
      bio: userProfile.bio,
      fullname: userProfile.fullname,
      nickname: userProfile.nickname,
      isFullNameVisible: userProfile.is_full_name_visible,
      avatar: userProfile.avatar,
      coverPhoto: userProfile.coverPhoto,
      birthday: userProfile.birthday,
      gender: userProfile.gender,
      email: userProfile.email,
      address: userProfile.address,
      originCountry: userProfile.origin_country?.id,
      visitedCountries: userProfile.visited_countries?.map(
        (country) => country.id,
      ),
      language: userProfile.languages?.map((language) => language.id),
      currency: userProfile.currencies?.map((currency) => currency.id),
      travelInterest: userProfile.travel_interests?.map(
        (interest) => interest.id,
      ),
      travelStyle: userProfile.travel_styles?.map((style) => style.id),
    };

    return userProfileSettingDto;
  }
}
