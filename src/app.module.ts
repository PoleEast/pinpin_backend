import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                //配置DB連線資料
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                synchronize: true,
                logging: true,
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        }),
        CloudinaryModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                cloud_name: configService.get('CLOUDINARY_NAME'),
                api_key: configService.get('CLOUDINARY_API_KEY'),
                api_secret: configService.get('CLOUDINARY_API_SECRET'),
            }),
            inject: [ConfigService],
        }),
        AuthModule,
    ],
})
export class AppModule {}

