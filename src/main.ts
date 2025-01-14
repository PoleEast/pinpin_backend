import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global_exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //設定全域驗證
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    //設定全域錯誤
    app.useGlobalFilters(new GlobalExceptionFilter());

    //設定CORS
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    //設定API前綴
    app.setGlobalPrefix('api');

    //設定swagger
    const config = new DocumentBuilder()
        .setTitle('PinPin API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    //設定cookie
    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
