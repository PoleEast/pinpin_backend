import { UserProfile } from '../entities/user_profiles.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileRepository {
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

