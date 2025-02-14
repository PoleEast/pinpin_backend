import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from '../../dtos/auth.dto.js';
import { AuthService } from './auth.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import ApiCommonResponses from '../../common/decorators/api_responses.decorator.js';
import { ApiResponseDTO, AuthResponseDTO } from 'pinpin_library';
import { Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import GetUser from '../../common/decorators/get-user.decorator.js';
import { User } from '../../entities/user.entity.js';

@ApiTags('用戶')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '註冊用戶' })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: '帳號已經存在',
    })
    @ApiCommonResponses(HttpStatus.CREATED, '註冊成功')
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

    @HttpCode(HttpStatus.OK)
    @ApiCommonResponses(HttpStatus.OK, '登入成功')
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '帳號或密碼錯誤',
    })
    @Post('login')
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

    @Get('logout')
    @HttpCode(HttpStatus.OK)
    @ApiCommonResponses(HttpStatus.OK, '登出成功')
    @ApiOperation({ summary: '登出用戶', description: '清除token' })
    async logout(
        @Res({ passthrough: true }) response: Response,
    ): Promise<ApiResponseDTO> {
        response.clearCookie('access_token');
        return {
            statusCode: HttpStatus.OK,
            message: '登出成功',
        };
    }

    @UseGuards(JwtGuard)
    @ApiOperation({ summary: '驗證token' })
    @ApiCommonResponses(HttpStatus.OK, '授權成功')
    @Get('check-auth')
    async CheckAuth(
        @GetUser() user: User,
    ): Promise<ApiResponseDTO<AuthResponseDTO>> {
        return {
            statusCode: HttpStatus.OK,
            message: '授權成功',
            data: {
                nickname: user.profile.nickname,
            },
        };
    }

    /**
     * 設定cookie
     * @param response express response
     * @param token jwt token
     */
    private setCookie(response: Response, token: string) {
        response.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
}

