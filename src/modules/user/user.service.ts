import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {
  LoginDto,
  LoginServiceDto,
  RegisterDto,
  RegisterServiceDto,
} from "../../dtos/user.dto.js";
import { User } from "../../entities/user.entity.js";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserRepositoryManager } from "../../repositories/user.repository.js";
import { JwtPayload } from "../../interfaces/jwt.interface.js";
import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepositoryManager: UserRepositoryManager,
    private readonly userprofileRepositoryManager: UserProfileRepositoryManager,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 註冊用戶
   *
   * @param registerDto 註冊資訊
   */
  async Register(registerDto: RegisterDto): Promise<RegisterServiceDto> {
    // 檢查帳號是否已經存在
    if (
      await this.userRepositoryManager.FindOneByAccount(registerDto.account)
    ) {
      throw new ConflictException("帳號已經存在");
    }

    //整理使用者資料

    const userProfile = this.userprofileRepositoryManager.New(
      registerDto.nickname,
    );

    const user = this.userRepositoryManager.New(
      registerDto.account,
      this.getHashPassword(registerDto.password),
      userProfile,
    );

    // 建立用戶
    const createdUser = await this.userRepositoryManager.Save(user);

    const registerServiceDto: RegisterServiceDto = {
      token: this.generateToken(createdUser),
      account: createdUser.account,
      nickname: createdUser.profile.nickname,
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
    const user = await this.userRepositoryManager.FindOneByAccountWithProfile(
      loginDto.account,
    );
    if (!user) {
      throw new UnauthorizedException("帳號或密碼錯誤");
    }

    //比對密碼是否正確(compareSync會將第一個參數加密後和第二個參數進行比對)
    if (!bcrypt.compareSync(loginDto.password, user.password_hash)) {
      throw new UnauthorizedException("帳號或密碼錯誤");
    }

    //回傳token和使用者資料
    const loginServiceDto: LoginServiceDto = {
      token: this.generateToken(user),
      account: user.account,
      nickname: user.profile.nickname,
    };

    //設定最後登入時間
    user.last_login_at = new Date();
    await this.userRepositoryManager.Save(user);

    return loginServiceDto;
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
