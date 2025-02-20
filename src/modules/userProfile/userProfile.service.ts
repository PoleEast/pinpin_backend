import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userRepositoryManager: UserRepositoryManager,
    private readonly userProfileRepositoryManager: UserProfileRepositoryManager,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
}
