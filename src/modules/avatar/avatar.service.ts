import { Injectable, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";
import { AvatarRepositoryManager } from "../../repositories/avatar.repository.js";
import { UploadApiResponse } from "cloudinary";
import AvatarDTO from "@/dtos/avatar.dto.js";
import { User } from "@/entities/user.entity.js";
import { Avatar } from "@/entities/avatar.entity.js";
import { EntityManager } from "typeorm";

@Injectable()
export class AvatarService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly avatorRepositoryManager: AvatarRepositoryManager,
  ) {}

  /**
   * 上傳用戶頭像。
   *
   * @param file - Express.Multer.File 格式的頭像文件。
   * @param user - 當前用戶的實體。
   * @returns 一個 Promise，解析為包含上傳頭像詳細信息的 `AvatarDTO`。
   *
   * 將用戶上傳的頭像文件轉換為 Base64 字符串，並上傳到 Cloudinary。
   * 然後創建並儲存一個新的頭像實體，最終返回頭像的數據傳輸對象。
   */
  async uploadAvatar(file: Express.Multer.File, user: User): Promise<AvatarDTO> {
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const response: UploadApiResponse = await this.cloudinaryService.uploadImage(fileBase64);

    const avatar = this.avatorRepositoryManager.New({
      public_id: response.public_id,
      user: user,
      type: 0,
    });
    const saveAvatar = await this.avatorRepositoryManager.Save(avatar);
    const avatarDTO: AvatarDTO = this.mapAvatarToDto(saveAvatar);

    return avatarDTO;
  }

  /**
   * 獲取預設頭像列表
   *
   * @returns 一個 Promise，解析為包含預設頭像列表的 `AvatarDTO` 陣列
   *
   * 從資料庫中獲取所有預設頭像，並將其轉換為 `AvatarDTO` 陣列
   */
  async getDefaultAvatar(): Promise<AvatarDTO[]> {
    const avatars = await this.avatorRepositoryManager.FindAllDefault();

    return avatars.map((avatar) => this.mapAvatarToDto(avatar));
  }

  /**
   * 獲取用戶的所有頭像
   *
   * @param user - 當前用戶的實體
   * @returns 一個 Promise，解析為包含用戶頭像列表的 `AvatarDTO` 陣列
   *
   * 從資料庫中獲取用戶的所有頭像，並將其轉換為 `AvatarDTO` 陣列
   * 並按照頭像的建立時間排序
   */
  async getUserAvatar(user: User): Promise<AvatarDTO[]> {
    const avatars = await this.avatorRepositoryManager.FindManyByUserId(user.id);

    return avatars.map((avatar) => this.mapAvatarToDto(avatar)).sort((a, b) => b.create_at.getTime() - a.create_at.getTime());
  }

  /**
   * 獲取隨機的預設頭像
   *
   * @returns 一個 Promise，解析為隨機的預設頭像的 `AvatarDTO` 實體
   *
   * 從資料庫中隨機獲取一個預設頭像，並將其轉換為 `AvatarDTO` 實體
   * 如果沒有預設頭像，則輸出警告訊息
   */
  async getRandomDefaultAvatar(): Promise<AvatarDTO> {
    const avatars = await this.avatorRepositoryManager.FindAllDefault();

    if (avatars.length === 0) {
      throw new NotFoundException("找不到預設頭像");
    }

    const randomIndex = Math.floor(Math.random() * avatars.length);
    const randomAvatar = avatars[randomIndex];

    return this.mapAvatarToDto(randomAvatar);
  }

  /**
   * 依據頭像ID獲取頭像
   *
   * @param id - 頭像的唯一標識符
   * @returns 一個 Promise，解析為頭像實體
   * @throws {NotFoundException} 如果找不到具有指定ID的頭像
   *
   * 使用給定的ID從資料庫中獲取頭像，如果找不到則拋出異常
   */

  async getAvatarById(id: number): Promise<Avatar> {
    const avatar = await this.avatorRepositoryManager.FindOneById(id);

    if (!avatar) {
      throw new NotFoundException("找不到頭像");
    }

    return avatar;
  }

  async getAvatarByIdInTransaction(id: number, manager: EntityManager): Promise<Avatar> {
    const avatar = await this.avatorRepositoryManager.FindOneByIdInTransaction(id, manager);

    if (!avatar) {
      throw new NotFoundException("找不到頭像");
    }

    return avatar;
  }

  private mapAvatarToDto(entity: Avatar): AvatarDTO {
    return {
      id: entity.id,
      public_id: entity.public_id,
      type: entity.type,
      create_at: entity.createAt,
    };
  }
}

export default AvatarService;
