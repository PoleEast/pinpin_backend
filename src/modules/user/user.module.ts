import { User } from '../../entities/user.entity.js';
import { UserProfile } from '../../entities/user_profiles.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { Module } from '@nestjs/common';
import { UserRepositoryManager } from '../../repositories/user.repository.js';
import { UserProfileRepository } from '../../repositories/userProfile.repository.js';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile])],
    controllers: [UserController],
    providers: [UserService, UserRepositoryManager, UserProfileRepository],
    exports: [UserRepositoryManager, UserProfileRepository],
})
export class UserModule {}

