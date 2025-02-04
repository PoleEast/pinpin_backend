import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from '../../dtos/auth.dto.js';
import { AuthService } from './auth.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '../../common/decorators/api_responses.decorator.js';
import { ApiResponseDTO, AuthResponseDTO } from 'pinpin_library';
import { Response } from 'express';

@ApiTags('用戶')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '註冊用戶' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: '註冊成功',
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: '帳號已經存在',
    })
    @ApiCommonResponses()
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<ApiResponseDTO<AuthResponseDTO>> {
        const result = await this.authService.Register(registerDto);

        //設定cookie
        this.setCookie(response, result.token);

        return {
            statusCode: HttpStatus.CREATED,
            message: '註冊成功',
            data: {
                nickname: result.nickname,
            },
        };
    }

    //TODO: 在library定義回傳格式
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: '登入成功',
    })
    @ApiCommonResponses()
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '帳號或密碼錯誤',
    })
    @Get('login')
    async Login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<ApiResponseDTO<AuthResponseDTO>> {
        const result = await this.authService.Login(loginDto);

        //設定cookie
        this.setCookie(response, result.token);

        return {
            statusCode: HttpStatus.CREATED,
            message: '登入成功',
            data: {
                nickname: result.nickname,
            },
        };
    }

    private setCookie(response: Response, token: string) {
        response.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
}
