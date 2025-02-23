import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";
import { UserProfile } from "@/entities/user_profile.entity.js";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userProfileRepositoryManager: UserProfileRepositoryManager,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getUserProfile(userId: number): Promise<> {
    const userProfile: UserProfile = await this.userProfileRepositoryManager.FindOneByIdwhitAll(userId);
  }
}
