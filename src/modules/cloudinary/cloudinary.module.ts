import {
    CloudinaryAsyncConfig,
    CloudinaryConfig,
} from '@/interfaces/cloudinary.interface.js';
import { DynamicModule, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { INJECTION_TOKEN } from '../../common/constants/constants.js';

@Module({})
export class CloudinaryModule {
    static forRootAsync(options: CloudinaryAsyncConfig): DynamicModule {
        return {
            module: CloudinaryModule,
            providers: [
                CloudinaryService,
                {
                    provide: INJECTION_TOKEN.CLOUDINARY_CONFIG,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
            ],
            exports: [CloudinaryService],
        };
    }
}

