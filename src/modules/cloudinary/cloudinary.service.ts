import { INJECTION_TOKEN } from '../../common/constants/constants.js';
import { CloudinaryConfig } from '@/interfaces/cloudinary.interface.js';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ApiResponseDTO } from 'pinpin_library';

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject(INJECTION_TOKEN.CLOUDINARY_CONFIG)
        private readonly config: CloudinaryConfig,
    ) {
        if (
            !this.config.cloud_name ||
            !this.config.api_key ||
            !this.config.api_secret
        ) {
            throw new Error('Cloudinary config is missing');
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
            const response = await cloudinary.api.ping();
        } catch (error) {
            throw new Error('Cloudinary connection failed');
        }
    }
}

