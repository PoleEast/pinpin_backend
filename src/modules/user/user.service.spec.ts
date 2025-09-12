jest.mock("bcrypt", () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));

import { UserService } from "./user.service.js";
import { UserRepositoryManager } from "../../repositories/user.repository.js";

import { Test, TestingModule } from "@nestjs/testing";
import { UserProfileService } from "../userProfile/userProfile.service.js";
import AvatarService from "../avatar/avatar.service.js";
import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";
import { User } from "@/entities/user.entity.js";

const mockUserRepositoryManager = {
  FindOneByAccount: jest.fn(),
  FindOneByAccountWithProfileWhitAvatar: jest.fn(),
  FindOneByIdWithProfileWhitAvatar: jest.fn(),
  New: jest.fn(),
  Save: jest.fn(),
};

const mockUserProfileService = {
  New: jest.fn(),
  NewAvatarChangeHistory: jest.fn(),
};

const mockAvatarService = {
  getRandomDefaultAvatar: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // 🔴 高學習價值：重置所有 mock 的預設行為
    // 確保每個測試都有乾淨的 mock 狀態
    mockUserRepositoryManager.FindOneByAccount.mockReset();
    mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockReset();
    mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockReset();
    mockUserRepositoryManager.Save.mockReset();
    mockUserProfileService.New.mockReset();
    mockAvatarService.getRandomDefaultAvatar.mockReset();
    mockJwtService.sign.mockReset();
    
    // 恢復 bcrypt mocks 的預設行為
    (bcrypt.hashSync as jest.Mock).mockReturnValue("defaultHashedPassword");
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositoryManager,
          useValue: mockUserRepositoryManager,
        },
        {
          provide: UserProfileService,
          useValue: mockUserProfileService,
        },
        {
          provide: AvatarService,
          useValue: mockAvatarService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe("login", () => {
    it("應該返回正確的登入資料", async () => {
      const loginDto = {
        account: "testAccount",
        password: "testPassword",
      };

      const mcokUser = {
        id: 1,
        account: "testAccount",
        passwordHash: "$2b$10$validHashedPassword",
        profile: {
          nickname: "TestUser",
          avatar: {
            public_id: "testAvatar",
          },
        },
        lastLoginAt: new Date(),
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(mcokUser);
      mockUserRepositoryManager.Save.mockResolvedValue(mcokUser);
      mockJwtService.sign.mockReturnValue("testJwtToken");

      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await service.Login(loginDto);

      expect(result).toEqual({
        token: "testJwtToken",
        account: "testAccount",
        nickname: "TestUser",
        avatar_public_id: "testAvatar",
      });

      expect(mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar).toHaveBeenCalledWith("testAccount");
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it("密碼輸入錯誤應該返回錯誤訊息", async () => {
      const loginDto = {
        account: "testAccount",
        password: "testPassword",
      };

      const mcokUser = {
        id: 1,
        account: "testAccount",
        passwordHash: "$2b$10$validHashedPassword",
        profile: {
          nickname: "TestUser",
          avatar: {
            public_id: "testAvatar",
          },
        },
        lastLoginAt: new Date(),
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(mcokUser);
      mockUserRepositoryManager.Save.mockResolvedValue(mcokUser);
      mockJwtService.sign.mockReturnValue("testJwtToken");

      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(service.Login(loginDto)).rejects.toThrow("帳號或密碼錯誤");
    });

    it("帳號不存在應該返回錯誤訊息", async () => {
      const loginDto = {
        account: "nonExistentAccount",
        password: "testPassword",
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(null);

      await expect(service.Login(loginDto)).rejects.toThrow("帳號或密碼錯誤");
      expect(mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar).toHaveBeenCalledWith("nonExistentAccount");
    });

    // 🔴 高學習價值：JWT 生成失敗場景
    it("JWT 生成失敗應該拋出錯誤", async () => {
      const loginDto = {
        account: "testAccount",
        password: "testPassword",
      };

      const mockUser = {
        id: 1,
        account: "testAccount",
        passwordHash: "$2b$10$validHashedPassword",
        profile: {
          nickname: "TestUser",
          avatar: {
            public_id: "testAvatar",
          },
        },
        lastLoginAt: new Date(),
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      
      // 模擬 JWT 生成失敗
      mockJwtService.sign.mockImplementation(() => {
        throw new Error("JWT generation failed");
      });

      await expect(service.Login(loginDto)).rejects.toThrow("JWT generation failed");
      
      expect(mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar).toHaveBeenCalledWith("testAccount");
      expect(bcrypt.compareSync).toHaveBeenCalledWith("testPassword", "$2b$10$validHashedPassword");
    });

    // 🔴 高學習價值：bcrypt 比對異常處理
    it("密碼比對異常應該正確處理", async () => {
      const loginDto = {
        account: "testAccount",
        password: "testPassword",
      };

      const mockUser = {
        id: 1,
        account: "testAccount",
        passwordHash: "$2b$10$validHashedPassword",
        profile: {
          nickname: "TestUser",
          avatar: {
            public_id: "testAvatar",
          },
        },
        lastLoginAt: new Date(),
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(mockUser);
      
      // 模擬 bcrypt.compareSync 拋出異常
      (bcrypt.compareSync as jest.Mock).mockImplementation(() => {
        throw new Error("bcrypt comparison failed");
      });

      await expect(service.Login(loginDto)).rejects.toThrow("bcrypt comparison failed");
      
      expect(mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar).toHaveBeenCalledWith("testAccount");
    });

    // 🔴 高學習價值：更新最後登入時間失敗場景
    it("更新最後登入時間失敗不應該影響登入流程", async () => {
      const loginDto = {
        account: "testAccount",
        password: "testPassword",
      };

      const mockUser = {
        id: 1,
        account: "testAccount",
        passwordHash: "$2b$10$validHashedPassword",
        profile: {
          nickname: "TestUser",
          avatar: {
            public_id: "testAvatar",
          },
        },
        lastLoginAt: new Date(),
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      mockJwtService.sign.mockReturnValue("testJwtToken");
      
      // 模擬保存最後登入時間失敗
      mockUserRepositoryManager.Save.mockRejectedValue(new Error("Update lastLoginAt failed"));

      await expect(service.Login(loginDto)).rejects.toThrow("Update lastLoginAt failed");
      
      // 驗證在失敗前的所有步驟都被正確調用
      expect(mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar).toHaveBeenCalledWith("testAccount");
      expect(bcrypt.compareSync).toHaveBeenCalledWith("testPassword", "$2b$10$validHashedPassword");
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    // 🔴 高學習價值：用戶資料不完整場景
    it("用戶資料缺少 profile 應該拋出錯誤", async () => {
      const loginDto = {
        account: "testAccount",
        password: "testPassword",
      };

      const mockUserWithoutProfile = {
        id: 1,
        account: "testAccount",
        passwordHash: "$2b$10$validHashedPassword",
        profile: null, // 缺少 profile 資料
        lastLoginAt: new Date(),
      };

      mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar.mockResolvedValue(mockUserWithoutProfile);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      await expect(service.Login(loginDto)).rejects.toThrow();
      
      expect(mockUserRepositoryManager.FindOneByAccountWithProfileWhitAvatar).toHaveBeenCalledWith("testAccount");
      expect(bcrypt.compareSync).toHaveBeenCalledWith("testPassword", "$2b$10$validHashedPassword");
    });
  });

  describe("Register", () => {
    it("應該成功註冊用戶", async () => {
      const registerDto = {
        account: "newUser",
        password: "password123",
        nickname: "NewUser",
      };

      const mockUserProfile = {
        id: 1,
        nickname: "NewUser",
        avatar: { id: 1, public_id: "default_avatar" },
        avatar_changed_history: [],
      };

      const mockUser = {
        id: 1,
        account: "newUser",
        passwordHash: "hashedPassword",
        profile: mockUserProfile,
      };

      const mockCreatedUser = {
        id: 1,
        account: "newUser",
        passwordHash: "hashedPassword",
        profile: {
          id: 1,
          nickname: "NewUser",
          avatar: { id: 1, public_id: "default_avatar" },
          avatar_changed_history: [],
        },
      };

      const mockLoadedUser = {
        id: 1,
        account: "newUser",
        profile: {
          nickname: "NewUser",
          avatar: { public_id: "default_avatar" },
        },
      };

      // Setup mocks
      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
      mockUserProfileService.New.mockReturnValue(mockUserProfile);
      mockAvatarService.getRandomDefaultAvatar.mockResolvedValue({ id: 1 });
      mockUserProfileService.NewAvatarChangeHistory.mockReturnValue({
        profile_id: 1,
        avatar_id: 1,
      });
      mockUserRepositoryManager.New.mockReturnValue(mockUser);
      mockUserRepositoryManager.Save.mockResolvedValue(mockCreatedUser);
      mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockResolvedValue(mockLoadedUser);
      mockJwtService.sign.mockReturnValue("newUserToken");
      (bcrypt.hashSync as jest.Mock).mockReturnValue("hashedPassword");

      const result = await service.Register(registerDto);

      expect(result).toEqual({
        token: "newUserToken",
        account: "newUser",
        nickname: "NewUser",
        avatar_public_id: "default_avatar",
      });

      expect(mockUserRepositoryManager.FindOneByAccount).toHaveBeenCalledWith("newUser");
      expect(mockUserProfileService.New).toHaveBeenCalledWith("NewUser");
      expect(mockAvatarService.getRandomDefaultAvatar).toHaveBeenCalled();
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it("帳號已存在應該拋出 ConflictException", async () => {
      const registerDto = {
        account: "existingUser",
        password: "password123",
        nickname: "ExistingUser",
      };

      const existingUser = { id: 1, account: "existingUser" };
      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(existingUser);

      await expect(service.Register(registerDto)).rejects.toThrow("帳號已經存在");
      expect(mockUserRepositoryManager.FindOneByAccount).toHaveBeenCalledWith("existingUser");
    });

    it("無法獲取預設頭像應該拋出錯誤", async () => {
      const registerDto = {
        account: "newUser",
        password: "password123",
        nickname: "NewUser",
      };

      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
      mockUserProfileService.New.mockReturnValue({
        id: 1,
        nickname: "NewUser",
        avatar_changed_history: [],
      });
      mockAvatarService.getRandomDefaultAvatar.mockResolvedValue({ id: null });

      await expect(service.Register(registerDto)).rejects.toThrow("找不到預設頭像");
    });

    it("用戶創建後無法查詢應該拋出錯誤", async () => {
      const registerDto = {
        account: "newUser",
        password: "password123",
        nickname: "NewUser",
      };

      const mockUserProfile = {
        id: 1,
        nickname: "NewUser",
        avatar: { id: 1 },
        avatar_changed_history: [],
      };

      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
      mockUserProfileService.New.mockReturnValue(mockUserProfile);
      mockAvatarService.getRandomDefaultAvatar.mockResolvedValue({ id: 1 });
      mockUserProfileService.NewAvatarChangeHistory.mockReturnValue({});
      mockUserRepositoryManager.New.mockReturnValue({});
      mockUserRepositoryManager.Save.mockResolvedValue({
        id: 1,
        profile: {
          id: 1,
          avatar: { id: 1 },
          avatar_changed_history: [],
        },
      });
      mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockResolvedValue(null);

      await expect(service.Register(registerDto)).rejects.toThrow("找不到用戶");
    });

    // 🔴 高學習價值：資料庫操作失敗場景
    it("資料庫保存失敗應該拋出錯誤", async () => {
      const registerDto = {
        account: "newUser",
        password: "password123",
        nickname: "NewUser",
      };

      const mockUserProfile = {
        id: 1,
        nickname: "NewUser",
        avatar: { id: 1 },
        avatar_changed_history: [],
      };

      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
      mockUserProfileService.New.mockReturnValue(mockUserProfile);
      mockAvatarService.getRandomDefaultAvatar.mockResolvedValue({ id: 1 });
      mockUserProfileService.NewAvatarChangeHistory.mockReturnValue({});
      mockUserRepositoryManager.New.mockReturnValue({});
      
      // 模擬資料庫保存失敗
      mockUserRepositoryManager.Save.mockRejectedValue(new Error("Database connection failed"));
      
      await expect(service.Register(registerDto)).rejects.toThrow("Database connection failed");
      
      // 驗證在失敗前的所有步驟都被正確調用
      expect(mockUserRepositoryManager.FindOneByAccount).toHaveBeenCalledWith("newUser");
      expect(mockUserProfileService.New).toHaveBeenCalledWith("NewUser");
      expect(mockAvatarService.getRandomDefaultAvatar).toHaveBeenCalled();
    });

    // 🔴 高學習價值：bcrypt 加密失敗場景
    it("密碼加密失敗應該拋出錯誤", async () => {
      const registerDto = {
        account: "newUser",
        password: "password123",
        nickname: "NewUser",
      };

      const mockUserProfile = {
        id: 1,
        nickname: "NewUser",
        avatar: { id: 1 },
        avatar_changed_history: [],
      };

      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
      mockUserProfileService.New.mockReturnValue(mockUserProfile);
      mockAvatarService.getRandomDefaultAvatar.mockResolvedValue({ id: 1 });
      mockUserProfileService.NewAvatarChangeHistory.mockReturnValue({});
      
      // 模擬 bcrypt 加密失敗
      (bcrypt.hashSync as jest.Mock).mockImplementation(() => {
        throw new Error("bcrypt encryption failed");
      });

      await expect(service.Register(registerDto)).rejects.toThrow("bcrypt encryption failed");
      
      expect(mockUserRepositoryManager.FindOneByAccount).toHaveBeenCalledWith("newUser");
    });

    // 🔴 高學習價值：頭像服務異常處理
    it("頭像服務異常應該正確處理", async () => {
      const registerDto = {
        account: "newUser",
        password: "password123",
        nickname: "NewUser",
      };

      mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
      mockUserProfileService.New.mockReturnValue({
        id: 1,
        nickname: "NewUser",
        avatar_changed_history: [],
      });
      
      // 模擬頭像服務拋出異常
      mockAvatarService.getRandomDefaultAvatar.mockRejectedValue(new Error("Avatar service unavailable"));

      await expect(service.Register(registerDto)).rejects.toThrow("Avatar service unavailable");
      
      expect(mockUserRepositoryManager.FindOneByAccount).toHaveBeenCalledWith("newUser");
      expect(mockUserProfileService.New).toHaveBeenCalledWith("NewUser");
      expect(mockAvatarService.getRandomDefaultAvatar).toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    it("應該成功更新用戶 email", async () => {
      const user = {
        id: 1,
        account: "testUser",
        email: "old@example.com",
        passwordHash: "oldHash",
      } as User;

      const accountDto = {
        email: "new@example.com",
      };

      const updatedUser = {
        ...user,
        email: "new@example.com",
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDto);

      expect(result.email).toBe("new@example.com");
      expect(result.account).toBe("testUser");
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledWith({
        ...user,
        email: "new@example.com",
      });
    });

    it("應該成功更新用戶密碼", async () => {
      const user = {
        id: 1,
        account: "testUser",
        email: "test@example.com",
        passwordHash: "oldHash",
      } as User;

      const accountDto = {
        password: "newPassword123",
      };

      (bcrypt.hashSync as jest.Mock).mockReturnValue("newHashedPassword");

      const updatedUser = {
        ...user,
        passwordHash: "newHashedPassword",
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith("newPassword123", 10);
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledWith({
        ...user,
        passwordHash: "newHashedPassword",
      });
      expect(result.account).toBe("testUser");
    });

    it("應該同時更新 email 和密碼", async () => {
      const user = {
        id: 1,
        account: "testUser",
        email: "old@example.com",
        passwordHash: "oldHash",
      } as User;

      const accountDto = {
        email: "new@example.com",
        password: "newPassword123",
      };

      (bcrypt.hashSync as jest.Mock).mockReturnValue("newHashedPassword");

      const updatedUser = {
        ...user,
        email: "new@example.com",
        passwordHash: "newHashedPassword",
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDto);

      expect(result.email).toBe("new@example.com");
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledWith({
        ...user,
        email: "new@example.com",
        passwordHash: "newHashedPassword",
      });
    });

    it("傳入 null 值應該保持原有值", async () => {
      const user = {
        id: 1,
        account: "testUser",
        email: "original@example.com",
        passwordHash: "originalHash",
      } as User;

      const accountDto = {
        email: undefined,
        password: undefined,
      };

      const updatedUser = {
        ...user,
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDto);

      expect(result.email).toBe("original@example.com");
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledWith({
        ...user,
        email: "original@example.com",
        passwordHash: "originalHash",
      });
    });

    it("用戶為 null 應該拋出 UnauthorizedException", async () => {
      const accountDto = {
        email: "test@example.com",
      };

      await expect(service.updateUser(null as unknown as User, accountDto)).rejects.toThrow("使用者授權失效");
    });
  });

  describe("getUserByIdWithProfileWhitAvatar", () => {
    it("應該返回正確的用戶資料", async () => {
      const userId = 1;
      const mockUser = {
        id: 1,
        account: "testAccount",
        profile: {
          nickname: "TestUser",
          avatar: {
            public_id: "testAvatar",
          },
        },
      };

      mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockResolvedValue(mockUser);

      const result = await service.getUserByIdWithProfileWhitAvatar(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar).toHaveBeenCalledWith(userId);
    });

    it("找不到用戶應該返回 null", async () => {
      const userId = 999;

      mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockResolvedValue(null);

      const result = await service.getUserByIdWithProfileWhitAvatar(userId);

      expect(result).toBeNull();
      expect(mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar).toHaveBeenCalledWith(userId);
    });
  });

  // 🔴 高學習價值：測試輔助函數
  // 這些輔助函數提高了測試的可維護性和可讀性
  
  /**
   * 創建標準的 mock 用戶資料
   */
  function createMockUser(overrides: Partial<any> = {}) {
    return {
      id: 1,
      account: "testAccount",
      passwordHash: "$2b$10$validHashedPassword",
      profile: {
        nickname: "TestUser",
        avatar: {
          public_id: "testAvatar",
        },
      },
      lastLoginAt: new Date(),
      ...overrides,
    };
  }

  /**
   * 創建標準的註冊 DTO
   */
  function createRegisterDto(overrides: Partial<any> = {}) {
    return {
      account: "newUser",
      password: "password123",
      nickname: "NewUser",
      ...overrides,
    };
  }

  /**
   * 設置成功註冊的所有 mock
   */
  function setupSuccessfulRegisterMocks() {
    const mockUserProfile = {
      id: 1,
      nickname: "NewUser",
      avatar: { id: 1, public_id: "default_avatar" },
      avatar_changed_history: [],
    };

    const mockCreatedUser = { id: 1 };
    const mockLoadedUser = createMockUser({
      account: "newUser",
      profile: {
        nickname: "NewUser",
        avatar: { public_id: "default_avatar" },
      },
    });

    mockUserRepositoryManager.FindOneByAccount.mockResolvedValue(null);
    mockUserProfileService.New.mockReturnValue(mockUserProfile);
    mockAvatarService.getRandomDefaultAvatar.mockResolvedValue({ id: 1 });
    mockUserProfileService.NewAvatarChangeHistory.mockReturnValue({
      profile_id: 1,
      avatar_id: 1,
    });
    mockUserRepositoryManager.New.mockReturnValue({});
    mockUserRepositoryManager.Save.mockResolvedValue(mockCreatedUser);
    mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockResolvedValue(mockLoadedUser);
    mockJwtService.sign.mockReturnValue("newUserToken");
    (bcrypt.hashSync as jest.Mock).mockReturnValue("hashedPassword");

    return { mockUserProfile, mockCreatedUser, mockLoadedUser };
  }
});