import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { RegisterDto } from 'src/dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api_responses.decorator';
import { ApiResponseDTO, RegisterResponseDTO } from 'pinpin_library';
import { Response } from 'express';

@ApiTags('用戶')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
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
    ): Promise<ApiResponseDTO<RegisterResponseDTO>> {
        const result = await this.authService.register(registerDto);

        //設定cookie
        response.cookie('access_token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
            statusCode: HttpStatus.CREATED,
            message: '註冊成功',
            data: {
                nickname: result.nickname,
            },
        };
    }
}
