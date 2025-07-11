import AvatarDTO from "@/dtos/avatar.dto.js";
import { UserProfileDto } from "@/dtos/userProfile.dto.js";
import { Avatar } from "@/entities/avatar.entity.js";
import { UserProfile } from "@/entities/user_profile.entity.js";

function mapAvatarToDto(entity: Avatar): AvatarDTO {
  return {
    id: entity.id,
    public_id: entity.public_id,
    type: entity.type,
    create_at: entity.createAt,
  };
}

function mapUserProfileToDto(entity: UserProfile): UserProfileDto {
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

export { mapAvatarToDto, mapUserProfileToDto };
