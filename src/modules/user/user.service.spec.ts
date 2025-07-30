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

      const mockCreatedUser = { id: 1 };

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
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledTimes(1);
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
      mockUserRepositoryManager.Save.mockResolvedValue({ id: 1 });
      mockUserRepositoryManager.FindOneByIdWithProfileWhitAvatar.mockResolvedValue(null);

      await expect(service.Register(registerDto)).rejects.toThrow("找不到用戶");
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

      const accountDTO = {
        email: "new@example.com",
      };

      const updatedUser = {
        ...user,
        email: "new@example.com",
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDTO);

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

      const accountDTO = {
        password: "newPassword123",
      };

      (bcrypt.hashSync as jest.Mock).mockReturnValue("newHashedPassword");

      const updatedUser = {
        ...user,
        passwordHash: "newHashedPassword",
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDTO);

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

      const accountDTO = {
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

      const result = await service.updateUser(user, accountDTO);

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

      const accountDTO = {
        email: undefined,
        password: undefined,
      };

      const updatedUser = {
        ...user,
      };

      mockUserRepositoryManager.Save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(user, accountDTO);

      expect(result.email).toBe("original@example.com");
      expect(mockUserRepositoryManager.Save).toHaveBeenCalledWith({
        ...user,
        email: "original@example.com",
        passwordHash: "originalHash",
      });
    });

    it("用戶為 null 應該拋出 UnauthorizedException", async () => {
      const accountDTO = {
        email: "test@example.com",
      };

      await expect(service.updateUser(null as unknown as User, accountDTO)).rejects.toThrow("使用者授權失效");
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
});
