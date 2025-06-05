import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/user/user.module.js";
import { UserProfileModule } from "./modules/userProfile/userProfile.module.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { CategoryModule } from "./modules/category/category.module.js";
import { AvatarModule } from "./modules/avatar/avatar.module.js";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "./modules/auth/auth.module.js";

//直接使用new URL("./entities/*.entity{.ts,.js}", import.meta.url).pathname會有前置的斜線
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        //配置DB連線資料
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        logging: true,
        entities: [join(__dirname, "entities", "*.entity{.ts,.js}")],
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
    PassportModule,
    UserModule,
    UserProfileModule,
    CategoryModule,
    AvatarModule,
    AuthModule,
  ],
})
export class AppModule {}
