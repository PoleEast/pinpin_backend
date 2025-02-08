import { UserProfile } from '../entities/user_profiles.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class userProfileRepository {
    constructor(
        @InjectRepository(UserProfile)
        private userRepository: Repository<UserProfile>,
    ) {}

    New(nickname: string): UserProfile {
        return this.userRepository.create({
            nickname: nickname,
        });
    }
}

