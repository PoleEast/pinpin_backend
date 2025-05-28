import { CLOUDINARY_CONFIG, INJECTION_TOKEN } from "../../common/constants/constants.js";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { v2 as cloudinary, ConfigOptions, UploadApiResponse } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(INJECTION_TOKEN.CLOUDINARY_CONFIG)
    private readonly config: ConfigOptions,
  ) {
    if (!this.config.cloud_name || !this.config.api_key || !this.config.api_secret) {
      throw new Error("Cloudinary config is missing");
    }

    cloudinary.config({
      cloud_name: this.config.cloud_name,
      api_key: this.config.api_key,
      api_secret: this.config.api_secret,
    });

    this.testconnection();
  }

  /**
   * 測試與 Cloudinary 的連接。
   *
   * 嘗試調用 Cloudinary API 的 ping 方法以確認服務器狀態。
   * 如果連接失敗，則拋出錯誤。
   */

  async testconnection() {
    try {
      await cloudinary.api.ping();
    } catch {
      throw new Error("Cloudinary connection failed");
    }
  }

  /**
   * 上傳圖片到 Cloudinary
   *
   * @param {string} fileBase64 - 圖片的 Base64 字串
   * @returns {Promise<UploadApiResponse>} - 上傳結果
   *
   * 嘗試上傳圖片到 Cloudinary，並 return 上傳結果
   * 如果上傳失敗，則拋出錯誤
   */
  async uploadImage(fileBase64: string): Promise<UploadApiResponse> {
    try {
      const response = await cloudinary.uploader.upload(fileBase64, {
        folder: CLOUDINARY_CONFIG.FOLDER_NAME.AVATAR,
        resource_type: "image",
        discard_original_filename: true,
        upload_preset: CLOUDINARY_CONFIG.UPLOAD_PRESETS.AVATAR,
        use_filename: false,
      });

      return response;
    } catch (error) {
      new Logger(CloudinaryService.name).error("上傳圖片失敗", error);
      throw error;
    }
  }
}
