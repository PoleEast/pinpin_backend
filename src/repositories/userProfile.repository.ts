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

  New(nickname: string): UserProfile {
    return this.userProfileRepository.create({
      nickname: nickname,
    });
  }
}
