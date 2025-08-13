import { Test, TestingModule } from "@nestjs/testing";
import { DataSource, EntityManager } from "typeorm";
import { NotFoundException } from "@nestjs/common";

import { UserProfileService } from "./userProfile.service.js";
import { UserProfileRepositoryManager } from "../../repositories/userProfile.repository.js";
import { AvatarChangeHistoryRepositoryManager } from "../../repositories/avatar_change_history.repository.js";
import AvatarService from "../avatar/avatar.service.js";

import { UserProfile } from "@/entities/user_profile.entity.js";
import { UserProfileDto } from "@/dtos/userProfile.dto.js";
import { AvatarChangeHistory } from "@/entities/avatar_change_history.entity.js";
import AvatarChangeHistoryDTO from "@/dtos/avatarChangeHistory.dto.js";
import AvatarDTO from "@/dtos/avatar.dto.js";

/**
 * 🔴 高學習價值：複雜依賴項的 Mock 設計
 * UserProfileService 有多個複雜依賴項，需要精心設計 mock 結構
 * 包括：Repository 管理器、服務類、數據庫事務管理器
 */

// Mock UserProfileRepositoryManager - 處理用戶檔案數據庫操作
const mockUserProfileRepositoryManager = {
  New: jest.fn(),
  FindOneByUserIdwhitAll: jest.fn(),
  FindOneByUserIdwithAllInTransaction: jest.fn(),
  SaveInTransaction: jest.fn(),
};

// Mock AvatarChangeHistoryRepositoryManager - 處理頭像變更歷史
const mockAvatarChangeHistoryRepositoryManager = {
  New: jest.fn(),
  SaveInTransaction: jest.fn(),
  FindManyByUserProfileIdWithAvatar: jest.fn(),
};

// Mock AvatarService - 頭像相關業務邏輯
const mockAvatarService = {
  getAvatarByIdInTransaction: jest.fn(),
};

// Mock DataSource 和 EntityManager - 數據庫事務管理
const mockEntityManager = {
  // EntityManager 的必要方法可以在這裡添加
} as Partial<EntityManager>;

const mockDataSource = {
  transaction: jest.fn(),
} as Partial<DataSource>;

/**
 * 🔴 高學習價值：測試數據工廠函數
 * 創建標準化的測試數據，提高測試的可維護性和一致性
 */

// 創建完整的 UserProfile 實體測試數據
function createMockUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  const defaultProfile = {
    id: 1,
    motto: "旅行是最好的投資",
    bio: "熱愛探索世界的旅行者",
    fullname: "張小明",
    nickname: "小明",
    isFullNameVisible: true,
    coverPhoto: "cover_photo_123",
    birthday: new Date("1990-01-01"),
    gender: 1,
    phone: "0912345678",
    address: "台北市信義區",
    avatar: {
      id: 1,
      public_id: "avatar_123",
      type: 0,
      createAt: new Date("2023-01-01"),
    },
    user: {
      id: 1,
      account: "testuser",
      email: "test@example.com",
      createAt: new Date("2023-01-01"),
    },
    originCountry: { id: 1, name: "Taiwan" },
    visitedCountries: [
      { id: 1, name: "Taiwan" },
      { id: 2, name: "Japan" },
    ],
    languages: [
      { id: 1, name: "Chinese" },
      { id: 2, name: "English" },
    ],
    currencies: [
      { id: 1, name: "TWD" },
      { id: 2, name: "USD" },
    ],
    travelInterests: [
      { id: 1, name: "Photography" },
      { id: 2, name: "Culture" },
    ],
    travelStyles: [
      { id: 1, name: "Backpacking" },
      { id: 2, name: "Luxury" },
    ],
    ...overrides,
  } as UserProfile;

  return defaultProfile;
}

// 創建 UserProfileDto 測試數據
function createMockUserProfileDto(overrides: Partial<UserProfileDto> = {}): UserProfileDto {
  return {
    motto: "更新後的座右銘",
    bio: "更新後的自我介紹",
    fullname: "王大華",
    nickname: "大華",
    isFullNameVisible: false,
    avatar: {
      id: 2,
      public_id: "updated_avatar_456",
      type: 1,
      create_at: new Date("2023-06-01"),
    },
    coverPhoto: "updated_cover_789",
    birthday: new Date("1985-05-15"),
    gender: 2,
    phone: "0987654321",
    address: "高雄市前鎮區",
    originCountry: 2,
    visitedCountries: [2, 3, 4],
    languages: [2, 3],
    currencies: [2],
    travelInterests: [3, 4],
    travelStyles: [2],
    ...overrides,
  } as UserProfileDto;
}

// 創建 AvatarChangeHistory 測試數據
function createMockAvatarChangeHistory(overrides: Partial<AvatarChangeHistory> = {}): AvatarChangeHistory {
  return {
    id: 1,
    profile_id: 1,
    avatar_id: 2,
    change_date: new Date("2023-06-01"),
    avatar: {
      id: 2,
      public_id: "new_avatar_456",
      type: 1,
      createAt: new Date("2023-06-01"),
    },
    ...overrides,
  } as AvatarChangeHistory;
}

describe("UserProfileService", () => {
  let service: UserProfileService;

  beforeEach(async () => {
    // 🔴 高學習價值：全面清理 mock 狀態
    // 確保每個測試都有乾淨的環境，避免測試間的相互影響
    jest.clearAllMocks();
    
    mockUserProfileRepositoryManager.New.mockReset();
    mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockReset();
    mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockReset();
    mockUserProfileRepositoryManager.SaveInTransaction.mockReset();
    
    mockAvatarChangeHistoryRepositoryManager.New.mockReset();
    mockAvatarChangeHistoryRepositoryManager.SaveInTransaction.mockReset();
    mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar.mockReset();
    
    mockAvatarService.getAvatarByIdInTransaction.mockReset();
    
    mockDataSource.transaction.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: UserProfileRepositoryManager,
          useValue: mockUserProfileRepositoryManager,
        },
        {
          provide: AvatarChangeHistoryRepositoryManager,
          useValue: mockAvatarChangeHistoryRepositoryManager,
        },
        {
          provide: AvatarService,
          useValue: mockAvatarService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
  });

  describe("New", () => {
    it("應該成功創建新的 UserProfile 實體", () => {
      // Arrange
      const nickname = "新用戶";
      const expectedProfile = createMockUserProfile({ nickname });
      mockUserProfileRepositoryManager.New.mockReturnValue(expectedProfile);

      // Act
      const result = service.New(nickname);

      // Assert
      expect(result).toEqual(expectedProfile);
      expect(mockUserProfileRepositoryManager.New).toHaveBeenCalledWith(nickname);
    });

    /**
     * 🔴 高學習價值：邊界值測試
     * 測試極端情況和邊界值，確保服務在各種輸入下都能正確工作
     */
    it("應該正確處理空字符串 nickname", () => {
      // Arrange
      const nickname = "";
      const expectedProfile = createMockUserProfile({ nickname });
      mockUserProfileRepositoryManager.New.mockReturnValue(expectedProfile);

      // Act
      const result = service.New(nickname);

      // Assert
      expect(result).toEqual(expectedProfile);
      expect(mockUserProfileRepositoryManager.New).toHaveBeenCalledWith(nickname);
    });

    it("應該正確處理包含特殊字符的 nickname", () => {
      // Arrange
      const nickname = "用戶@#$%^&*()";
      const expectedProfile = createMockUserProfile({ nickname });
      mockUserProfileRepositoryManager.New.mockReturnValue(expectedProfile);

      // Act
      const result = service.New(nickname);

      // Assert
      expect(result).toEqual(expectedProfile);
      expect(mockUserProfileRepositoryManager.New).toHaveBeenCalledWith(nickname);
    });
  });

  describe("getUserProfile", () => {
    it("應該成功獲取完整的用戶個人資料", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);

      // Act
      const result = await service.getUserProfile(userId);

      // Assert
      expect(result).toEqual({
        motto: mockProfile.motto,
        bio: mockProfile.bio,
        fullname: mockProfile.fullname,
        nickname: mockProfile.nickname,
        isFullNameVisible: mockProfile.isFullNameVisible,
        avatar: {
          id: mockProfile.avatar.id,
          public_id: mockProfile.avatar.public_id,
          type: mockProfile.avatar.type,
          create_at: mockProfile.avatar.createAt,
        },
        coverPhoto: mockProfile.coverPhoto,
        birthday: mockProfile.birthday,
        phone: mockProfile.phone,
        gender: mockProfile.gender,
        address: mockProfile.address,
        originCountry: mockProfile.originCountry?.id,
        visitedCountries: mockProfile.visitedCountries?.map(c => c.id),
        languages: mockProfile.languages?.map(l => l.id),
        currencies: mockProfile.currencies?.map(c => c.id),
        travelInterests: mockProfile.travelInterests?.map(i => i.id),
        travelStyles: mockProfile.travelStyles?.map(s => s.id),
        user: {
          account: mockProfile.user.account,
          email: mockProfile.user.email,
          createAt: mockProfile.user.createAt,
        },
      });
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwhitAll).toHaveBeenCalledWith(userId);
    });

    /**
     * 🔴 高學習價值：異常處理測試
     * 測試各種異常情況，確保服務能正確拋出適當的錯誤
     */
    it("找不到用戶個人資料時應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 999;
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserProfile(userId)).rejects.toThrow(
        new NotFoundException("用戶個人資料查詢失敗")
      );
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwhitAll).toHaveBeenCalledWith(userId);
    });

    it("應該正確處理部分數據為空的情況", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile({
        originCountry: null,
        visitedCountries: [],
        languages: null,
        currencies: undefined,
        travelInterests: [],
        travelStyles: null,
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);

      // Act
      const result = await service.getUserProfile(userId);

      // Assert
      expect(result.originCountry).toBeUndefined();
      expect(result.visitedCountries).toEqual([]);
      expect(result.languages).toBeUndefined();
      expect(result.currencies).toBeUndefined();
      expect(result.travelInterests).toEqual([]);
      expect(result.travelStyles).toBeUndefined();
    });

    /**
     * 🔴 高學習價值：數據庫異常處理
     * 測試數據庫操作失敗的情況
     */
    it("數據庫查詢異常時應該正確拋出錯誤", async () => {
      // Arrange
      const userId = 1;
      const dbError = new Error("Database connection failed");
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.getUserProfile(userId)).rejects.toThrow(dbError);
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwhitAll).toHaveBeenCalledWith(userId);
    });
  });

  describe("updateUserProfile", () => {
    /**
     * 🔴 高學習價值：事務處理測試
     * 測試複雜的數據庫事務操作，確保 ACID 特性
     */
    it("應該在事務中成功更新用戶個人資料", async () => {
      // Arrange
      const userId = 1;
      const userProfileDto = createMockUserProfileDto();
      const mockProfile = createMockUserProfile();
      const updatedProfile = createMockUserProfile({
        ...mockProfile,
        ...userProfileDto,
      });

      // Mock transaction callback
      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });

      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      mockUserProfileRepositoryManager.SaveInTransaction.mockResolvedValue(updatedProfile);
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction
        .mockResolvedValueOnce(mockProfile)  // 第一次調用返回原始數據
        .mockResolvedValueOnce(updatedProfile);  // 第二次調用返回更新後數據

      // Mock mapUserProfileToDto function
      jest.doMock("../../common/mappers/entityMapper.map.js", () => ({
        mapUserProfileToDto: jest.fn().mockReturnValue(userProfileDto),
      }));

      // Act
      const result = await service.updateUserProfile(userId, userProfileDto);

      // Assert
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction)
        .toHaveBeenCalledWith(userId, mockEntityManager);
      expect(mockUserProfileRepositoryManager.SaveInTransaction)
        .toHaveBeenCalledWith(expect.objectContaining({
          motto: userProfileDto.motto,
          bio: userProfileDto.bio,
          fullname: userProfileDto.fullname,
          nickname: userProfileDto.nickname,
          isFullNameVisible: userProfileDto.isFullNameVisible,
        }), mockEntityManager);
    });

    it("找不到用戶個人資料時應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 999;
      const userProfileDto = createMockUserProfileDto();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateUserProfile(userId, userProfileDto)).rejects.toThrow(
        new NotFoundException(`用戶:${userId}個人資料查詢失敗`)
      );
    });

    it("更新後找不到用戶個人資料時應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 1;
      const userProfileDto = createMockUserProfileDto();
      const mockProfile = createMockUserProfile();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction
        .mockResolvedValueOnce(mockProfile)  // 第一次調用成功
        .mockResolvedValueOnce(null);  // 第二次調用失敗
      mockUserProfileRepositoryManager.SaveInTransaction.mockResolvedValue(mockProfile);

      // Act & Assert
      await expect(service.updateUserProfile(userId, userProfileDto)).rejects.toThrow(
        new NotFoundException(`用戶:${userId}個人資料查詢失敗`)
      );
    });

    /**
     * 🔴 高學習價值：事務回滾測試
     * 測試事務失敗時的回滾機制
     */
    it("事務執行失敗時應該正確回滾", async () => {
      // Arrange
      const userId = 1;
      const userProfileDto = createMockUserProfileDto();
      const transactionError = new Error("Transaction failed");

      mockDataSource.transaction.mockRejectedValue(transactionError);

      // Act & Assert
      await expect(service.updateUserProfile(userId, userProfileDto)).rejects.toThrow(transactionError);
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });

    it("應該正確處理 isFullNameVisible 的默認值", async () => {
      // Arrange
      const userId = 1;
      const userProfileDto = createMockUserProfileDto({ isFullNameVisible: undefined });
      const mockProfile = createMockUserProfile();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      mockUserProfileRepositoryManager.SaveInTransaction.mockResolvedValue(mockProfile);
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(mockProfile);

      // Act
      await service.updateUserProfile(userId, userProfileDto);

      // Assert
      expect(mockUserProfileRepositoryManager.SaveInTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          isFullNameVisible: false,  // 默認值應該是 false
        }),
        mockEntityManager
      );
    });
  });

  describe("updateAvatar", () => {
    /**
     * 🔴 高學習價值：複雜業務邏輯測試
     * 測試包含多個步驟的複雜業務流程
     */
    it("應該成功更新用戶頭像", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 2;
      const mockProfile = createMockUserProfile();
      const newAvatar = {
        id: 2,
        public_id: "new_avatar_456",
        type: 1,
        createAt: new Date("2023-06-01"),
      };
      const mockAvatarChangeHistory = createMockAvatarChangeHistory();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      mockAvatarService.getAvatarByIdInTransaction.mockResolvedValue(newAvatar);
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(mockAvatarChangeHistory);
      mockUserProfileRepositoryManager.SaveInTransaction.mockResolvedValue(mockProfile);
      mockAvatarChangeHistoryRepositoryManager.SaveInTransaction.mockResolvedValue(mockAvatarChangeHistory);

      // Act
      const result = await service.updateAvatar(userId, avatarId);

      // Assert
      expect(result).toEqual({
        id: newAvatar.id,
        public_id: newAvatar.public_id,
        type: newAvatar.type,
        create_at: newAvatar.createAt,
      });
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction)
        .toHaveBeenCalledWith(userId, mockEntityManager);
      expect(mockAvatarService.getAvatarByIdInTransaction)
        .toHaveBeenCalledWith(avatarId, mockEntityManager);
      expect(mockAvatarChangeHistoryRepositoryManager.SaveInTransaction)
        .toHaveBeenCalledWith(mockAvatarChangeHistory, mockEntityManager);
      expect(mockUserProfileRepositoryManager.SaveInTransaction)
        .toHaveBeenCalledWith(expect.objectContaining({
          avatar: newAvatar,
        }), mockEntityManager);
    });

    it("頭像 ID 相同時應該直接返回現有頭像資訊", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 1;  // 與現有頭像相同
      const mockProfile = createMockUserProfile();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);

      // Act
      const result = await service.updateAvatar(userId, avatarId);

      // Assert
      expect(result).toEqual({
        id: mockProfile.avatar.id,
        public_id: mockProfile.avatar.public_id,
        type: mockProfile.avatar.type,
        create_at: mockProfile.avatar.createAt,
      });
      // 不應該調用頭像服務或保存操作
      expect(mockAvatarService.getAvatarByIdInTransaction).not.toHaveBeenCalled();
      expect(mockUserProfileRepositoryManager.SaveInTransaction).not.toHaveBeenCalled();
    });

    /**
     * 🔴 高學習價值：參數驗證測試
     * 測試輸入參數的各種邊界條件
     */
    it("無效的頭像 ID 應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 1;
      const invalidAvatarId = 0;

      // Act & Assert
      await expect(service.updateAvatar(userId, invalidAvatarId)).rejects.toThrow(
        new NotFoundException("無效的頭像 ID")
      );
    });

    it("負數頭像 ID 應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 1;
      const negativeAvatarId = -1;

      // Act & Assert
      await expect(service.updateAvatar(userId, negativeAvatarId)).rejects.toThrow(
        new NotFoundException("無效的頭像 ID")
      );
    });

    it("找不到用戶個人資料時應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 999;
      const avatarId = 2;

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateAvatar(userId, avatarId)).rejects.toThrow(
        new NotFoundException(`用戶:${userId}個人資料查詢失敗`)
      );
    });

    it("找不到指定頭像時應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 999;
      const mockProfile = createMockUserProfile();

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      mockAvatarService.getAvatarByIdInTransaction.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateAvatar(userId, avatarId)).rejects.toThrow(
        new NotFoundException(`Avatar ${avatarId} 不存在`)
      );
    });

    /**
     * 🔴 高學習價值：事務內依賴服務失敗測試
     * 測試事務內依賴服務調用失敗的情況
     */
    it("頭像服務異常時應該正確傳播錯誤", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 2;
      const mockProfile = createMockUserProfile();
      const avatarServiceError = new Error("Avatar service unavailable");

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      mockAvatarService.getAvatarByIdInTransaction.mockRejectedValue(avatarServiceError);

      // Act & Assert
      await expect(service.updateAvatar(userId, avatarId)).rejects.toThrow(avatarServiceError);
    });

    it("保存頭像變更歷史失敗時應該回滾事務", async () => {
      // Arrange
      const userId = 1;
      const avatarId = 2;
      const mockProfile = createMockUserProfile();
      const newAvatar = { id: 2, public_id: "new_avatar", type: 1, createAt: new Date() };
      const mockAvatarChangeHistory = createMockAvatarChangeHistory();
      const saveError = new Error("Failed to save avatar change history");

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      mockAvatarService.getAvatarByIdInTransaction.mockResolvedValue(newAvatar);
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(mockAvatarChangeHistory);
      mockAvatarChangeHistoryRepositoryManager.SaveInTransaction.mockRejectedValue(saveError);

      // Act & Assert
      await expect(service.updateAvatar(userId, avatarId)).rejects.toThrow(saveError);
    });
  });

  describe("getChangeHistoryAvatar", () => {
    it("應該成功獲取用戶頭像變更歷史", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();
      const mockAvatarChangeHistory = [
        createMockAvatarChangeHistory({ id: 1, avatar_id: 1 }),
        createMockAvatarChangeHistory({ id: 2, avatar_id: 2 }),
      ];

      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);
      mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar
        .mockResolvedValue(mockAvatarChangeHistory);

      // Act
      const result = await service.getChangeHistoryAvatar(userId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockAvatarChangeHistory[0].avatar.id,
        avatar: {
          id: mockAvatarChangeHistory[0].avatar.id,
          public_id: mockAvatarChangeHistory[0].avatar.public_id,
          type: mockAvatarChangeHistory[0].avatar.type,
          create_at: mockAvatarChangeHistory[0].avatar.createAt,
        },
        change_date: mockAvatarChangeHistory[0].change_date,
      });
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwhitAll)
        .toHaveBeenCalledWith(userId);
      expect(mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar)
        .toHaveBeenCalledWith(mockProfile.id);
    });

    it("找不到用戶個人資料時應該拋出 NotFoundException", async () => {
      // Arrange
      const userId = 999;
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getChangeHistoryAvatar(userId)).rejects.toThrow(
        new NotFoundException(`用戶:${userId}個人資料查詢失敗`)
      );
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwhitAll)
        .toHaveBeenCalledWith(userId);
    });

    it("應該正確處理空的頭像變更歷史", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();

      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);
      mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar
        .mockResolvedValue([]);

      // Act
      const result = await service.getChangeHistoryAvatar(userId);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    /**
     * 🔴 高學習價值：數據映射測試
     * 測試複雜的數據結構映射邏輯
     */
    it("應該正確映射頭像變更歷史數據結構", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();
      const mockAvatarChangeHistory = [
        {
          id: 1,
          profile_id: 1,
          avatar_id: 10,
          change_date: new Date("2023-01-01"),
          avatar: {
            id: 10,
            public_id: "avatar_history_1",
            type: 0,
            createAt: new Date("2023-01-01"),
          },
        },
        {
          id: 2,
          profile_id: 1,
          avatar_id: 20,
          change_date: new Date("2023-02-01"),
          avatar: {
            id: 20,
            public_id: "avatar_history_2",
            type: 1,
            createAt: new Date("2023-02-01"),
          },
        },
      ];

      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);
      mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar
        .mockResolvedValue(mockAvatarChangeHistory);

      // Act
      const result = await service.getChangeHistoryAvatar(userId);

      // Assert
      expect(result).toHaveLength(2);
      
      // 驗證第一筆記錄
      expect(result[0]).toEqual({
        id: 10,  // avatar.id
        avatar: {
          id: 10,
          public_id: "avatar_history_1",
          type: 0,
          create_at: new Date("2023-01-01"),
        },
        change_date: new Date("2023-01-01"),
      });

      // 驗證第二筆記錄
      expect(result[1]).toEqual({
        id: 20,  // avatar.id
        avatar: {
          id: 20,
          public_id: "avatar_history_2",
          type: 1,
          create_at: new Date("2023-02-01"),
        },
        change_date: new Date("2023-02-01"),
      });
    });

    it("查詢頭像變更歷史失敗時應該正確拋出錯誤", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();
      const dbError = new Error("Database query failed");

      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);
      mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar
        .mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.getChangeHistoryAvatar(userId)).rejects.toThrow(dbError);
    });
  });

  describe("NewAvatarChangeHistory", () => {
    it("應該成功創建新的頭像變更歷史記錄", () => {
      // Arrange
      const userId = 1;
      const avatarId = 2;
      const mockAvatarChangeHistory = createMockAvatarChangeHistory({
        profile_id: userId,
        avatar_id: avatarId,
      });
      
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(mockAvatarChangeHistory);

      // Act
      const result = service.NewAvatarChangeHistory(userId, avatarId);

      // Assert
      expect(result).toEqual(mockAvatarChangeHistory);
      expect(mockAvatarChangeHistoryRepositoryManager.New)
        .toHaveBeenCalledWith(userId, avatarId);
    });

    /**
     * 🔴 高學習價值：邊界值和異常輸入測試
     */
    it("應該正確處理零值 ID", () => {
      // Arrange
      const userId = 0;
      const avatarId = 0;
      const mockAvatarChangeHistory = createMockAvatarChangeHistory({
        profile_id: userId,
        avatar_id: avatarId,
      });
      
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(mockAvatarChangeHistory);

      // Act
      const result = service.NewAvatarChangeHistory(userId, avatarId);

      // Assert
      expect(result).toEqual(mockAvatarChangeHistory);
      expect(mockAvatarChangeHistoryRepositoryManager.New)
        .toHaveBeenCalledWith(userId, avatarId);
    });

    it("應該正確處理負數 ID", () => {
      // Arrange
      const userId = -1;
      const avatarId = -2;
      const mockAvatarChangeHistory = createMockAvatarChangeHistory({
        profile_id: userId,
        avatar_id: avatarId,
      });
      
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(mockAvatarChangeHistory);

      // Act
      const result = service.NewAvatarChangeHistory(userId, avatarId);

      // Assert
      expect(result).toEqual(mockAvatarChangeHistory);
      expect(mockAvatarChangeHistoryRepositoryManager.New)
        .toHaveBeenCalledWith(userId, avatarId);
    });
  });

  /**
   * 🔴 高學習價值：整合測試範例
   * 測試多個方法之間的協作，模擬真實業務流程
   */
  describe("Integration Tests", () => {
    it("完整的用戶檔案更新流程測試", async () => {
      // Arrange - 設置一個完整的用戶檔案更新流程
      const userId = 1;
      const originalProfile = createMockUserProfile();
      const updateDto = createMockUserProfileDto();
      const newAvatarId = 5;

      // Step 1: 獲取原始檔案
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(originalProfile);

      // Step 2: 更新檔案
      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(originalProfile);
      mockUserProfileRepositoryManager.SaveInTransaction.mockResolvedValue(originalProfile);
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction
        .mockResolvedValueOnce(originalProfile)
        .mockResolvedValueOnce(originalProfile);

      jest.doMock("../../common/mappers/entityMapper.map.js", () => ({
        mapUserProfileToDto: jest.fn().mockReturnValue(updateDto),
      }));

      // Step 3: 更新頭像
      const newAvatar = { id: newAvatarId, public_id: "new_avatar", type: 1, createAt: new Date() };
      const mockAvatarChangeHistory = createMockAvatarChangeHistory();
      
      mockAvatarService.getAvatarByIdInTransaction.mockResolvedValue(newAvatar);
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(mockAvatarChangeHistory);

      // Step 4: 獲取頭像變更歷史
      const updatedHistory = [mockAvatarChangeHistory];
      mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar
        .mockResolvedValue(updatedHistory);

      // Act - 執行完整流程
      const originalData = await service.getUserProfile(userId);
      const updatedProfile = await service.updateUserProfile(userId, updateDto);
      const avatarResult = await service.updateAvatar(userId, newAvatarId);
      const historyResult = await service.getChangeHistoryAvatar(userId);

      // Assert - 驗證整個流程
      expect(originalData).toBeDefined();
      expect(updatedProfile).toBeDefined();
      expect(avatarResult.id).toBe(newAvatarId);
      expect(historyResult).toHaveLength(1);
      
      // 驗證方法調用順序和次數
      expect(mockUserProfileRepositoryManager.FindOneByUserIdwhitAll).toHaveBeenCalledTimes(2);
      expect(mockDataSource.transaction).toHaveBeenCalledTimes(2);
      expect(mockAvatarService.getAvatarByIdInTransaction).toHaveBeenCalledWith(newAvatarId, mockEntityManager);
    });

    /**
     * 🔴 高學習價值：錯誤恢復測試
     * 測試在複雜流程中出現錯誤時的處理機制
     */
    it("檔案更新失敗後仍能正常查詢資料", async () => {
      // Arrange
      const userId = 1;
      const originalProfile = createMockUserProfile();
      const updateDto = createMockUserProfileDto();

      // 第一次查詢成功
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(originalProfile);

      // 更新失敗
      mockDataSource.transaction.mockRejectedValue(new Error("Update failed"));

      // 後續查詢仍然成功
      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(originalProfile);

      // Act & Assert
      const originalData = await service.getUserProfile(userId);
      expect(originalData).toBeDefined();

      await expect(service.updateUserProfile(userId, updateDto)).rejects.toThrow("Update failed");

      // 確認失敗後仍能查詢
      const dataAfterFailedUpdate = await service.getUserProfile(userId);
      expect(dataAfterFailedUpdate).toBeDefined();
      expect(dataAfterFailedUpdate).toEqual(originalData);
    });
  });

  /**
   * 🔴 高學習價值：效能測試範例
   * 測試服務方法的效能表現
   */
  describe("Performance Tests", () => {
    it("大量頭像變更歷史查詢效能測試", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();
      const largeHistoryData = Array.from({ length: 1000 }, (_, index) => 
        createMockAvatarChangeHistory({
          id: index + 1,
          avatar_id: index + 1,
          change_date: new Date(2023, 0, index + 1),
        })
      );

      mockUserProfileRepositoryManager.FindOneByUserIdwhitAll.mockResolvedValue(mockProfile);
      mockAvatarChangeHistoryRepositoryManager.FindManyByUserProfileIdWithAvatar
        .mockResolvedValue(largeHistoryData);

      // Act
      const startTime = Date.now();
      const result = await service.getChangeHistoryAvatar(userId);
      const endTime = Date.now();

      // Assert
      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // 應該在 100ms 內完成
    });
  });

  /**
   * 🔴 高學習價值：並發測試範例
   * 測試多個並發請求的處理能力
   */
  describe("Concurrency Tests", () => {
    it("並發頭像更新請求應該正確處理", async () => {
      // Arrange
      const userId = 1;
      const mockProfile = createMockUserProfile();
      const avatarIds = [2, 3, 4];
      const avatars = avatarIds.map(id => ({ 
        id, 
        public_id: `avatar_${id}`, 
        type: 1, 
        createAt: new Date() 
      }));

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });
      mockUserProfileRepositoryManager.FindOneByUserIdwithAllInTransaction.mockResolvedValue(mockProfile);
      
      avatarIds.forEach((id, index) => {
        mockAvatarService.getAvatarByIdInTransaction
          .mockResolvedValueOnce(avatars[index]);
      });
      
      mockAvatarChangeHistoryRepositoryManager.New.mockReturnValue(createMockAvatarChangeHistory());

      // Act
      const promises = avatarIds.map(avatarId => 
        service.updateAvatar(userId, avatarId)
      );
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.id).toBe(avatarIds[index]);
      });
    });
  });
});