import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccountDTO, LoginDto, LoginServiceDto, RegisterDto, RegisterServiceDto } from "../../dtos/user.dto.js";
import { User } from "../../entities/user.entity.js";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { JwtPayload } from "../../interfaces/jwt.interface.js";
import { UserProfileService } from "../userProfile/userProfile.service.js";
import AvatarService from "../avatar/avatar.service.js";
import { mapIdsToEntities } from "../../common/utils/entity.utils.js";
import { Avatar } from "../../entities/avatar.entity.js";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryManager: UserRepositoryManager,
    private readonly userProfileService: UserProfileService,
    private readonly avatarService: AvatarService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 註冊用戶
   *
   * @param registerDto 註冊資訊
   */
  async Register(registerDto: RegisterDto): Promise<RegisterServiceDto> {
    // 檢查帳號是否已經存在
    if (await this.userRepositoryManager.FindOneByAccount(registerDto.account)) {
      throw new ConflictException("帳號已經存在");
    }

    //整理使用者資料

    const userProfile = this.userProfileService.New(registerDto.nickname);

    const defaultAvatarId = (await this.avatarService.getRandomDefaultAvatar()).id;
    const avatarEntity: Avatar | undefined = mapIdsToEntities(defaultAvatarId);
    if (!avatarEntity) {
      throw new Error("找不到預設頭像");
    }
    userProfile.avatar = avatarEntity;

    const avatarChangeHistory = this.userProfileService.NewAvatarChangeHistory(userProfile.id, userProfile.avatar.id);
    userProfile.avatar_changed_history.push(avatarChangeHistory);

    const user = this.userRepositoryManager.New(registerDto.account, this.getHashPassword(registerDto.password), userProfile);

    // 建立用戶
    const createdUser = await this.userRepositoryManager.Save(user);

    const loadUser = await this.userRepositoryManager.FindOneByIdWithProfileWhitAvatar(createdUser.id);

    if (!loadUser) {
      throw new Error("找不到用戶");
    }

    const registerServiceDto: RegisterServiceDto = {
      token: this.generateToken(loadUser),
      account: loadUser.account,
      nickname: loadUser.profile.nickname,
      avatar_public_id: loadUser.profile.avatar.public_id,
    };

    return registerServiceDto;
  }

  /**
   * 依據帳號和密碼登入
   *
   * @param loginDto 帳號和密碼
   * @returns 帳號和token
   * @throws UnauthorizedException 帳號或密碼錯誤
   */
  async Login(loginDto: LoginDto): Promise<LoginServiceDto> {
    const user = await this.userRepositoryManager.FindOneByAccountWithProfileWhitAvatar(loginDto.account);
    if (!user) {
      throw new UnauthorizedException("帳號或密碼錯誤");
    }

    //比對密碼是否正確(compareSync會將第一個參數加密後和第二個參數進行比對)
    if (!bcrypt.compareSync(loginDto.password, user.passwordHash)) {
      throw new UnauthorizedException("帳號或密碼錯誤");
    }

    //回傳token和使用者資料
    const loginServiceDto: LoginServiceDto = {
      token: this.generateToken(user),
      account: user.account,
      nickname: user.profile.nickname,
      avatar_public_id: user.profile.avatar.public_id,
    };

    //設定最後登入時間
    user.lastLoginAt = new Date();
    await this.userRepositoryManager.Save(user);

    return loginServiceDto;
  }

  /**
   * 依據使用者資料和AccountRequestDTO更新使用者資料
   *
   * @param user 使用者資料
   * @param accountRequestDTO 要更新的資料
   * @returns AccountRequestDTO
   * @throws UnauthorizedException 使用者授權失效
   */
  async updateUser(user: User, accountDTO: AccountDTO): Promise<AccountDTO> {
    if (!user) {
      throw new UnauthorizedException("使用者授權失效");
    }

    user.email = accountDTO.email ?? user.email;
    user.passwordHash = accountDTO.password ? this.getHashPassword(accountDTO.password) : user.passwordHash;

    const updatedUser = await this.userRepositoryManager.Save(user);

    accountDTO.account = updatedUser.account;
    accountDTO.email = updatedUser.email;

    return accountDTO;
  }

  /**
   * 依據使用者 ID 獲取用戶資料
   *
   * @param id 使用者 ID
   * @returns User | null
   * @throws {NotFoundException} 如果找不到用戶
   */
  async getUserByIdWithProfileWhitAvatar(id: number): Promise<User | null> {
    return await this.userRepositoryManager.FindOneByIdWithProfileWhitAvatar(id);
  }

  //TODO: 第二版預定實作refresh token
  private generateToken(user: User): string {
    const payload: JwtPayload = {
      account: user.account,
      nickname: user.profile.nickname,
      id: user.id,
    };

    const jwtToken = this.jwtService.sign(payload);

    return jwtToken;
  }

  /**
   * 將密碼轉換為雜湊值
   * @param password 明文密碼
   * @returns 雜湊後的密碼
   */
  private getHashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
