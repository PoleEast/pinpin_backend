import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (ConfigService: ConfigService) => ({
                //配置DB連線資料
                type: 'mysql',
                host: ConfigService.get('DB_HOST'),
                port: ConfigService.get('DB_PORT'),
                username: ConfigService.get('DB_USERNAME'),
                password: ConfigService.get('DB_PASSWORD'),
                database: ConfigService.get('DB_DATABASE'),
                entities: [__dirname + '**'],
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
