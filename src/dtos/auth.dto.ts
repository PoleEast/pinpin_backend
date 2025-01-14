import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    REGISTER_REQUSER_VALIDATION,
    RegisterRequestDTO,
} from 'pinpin_library';

class RegisterDto implements RegisterRequestDTO {
    @ApiProperty({ description: '帳號', example: 'superman' })
    @IsString()
    @IsNotEmpty()
    @MinLength(REGISTER_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH)
    @MaxLength(REGISTER_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH)
    @Matches(REGISTER_REQUSER_VALIDATION.ACCOUNT.PATTERN, {
        message: REGISTER_REQUSER_VALIDATION.ACCOUNT.PATTERN_MESSAGE,
    })
    account: string;

    @ApiProperty({ description: '密碼', example: '123456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(REGISTER_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH)
    @MaxLength(REGISTER_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH)
    password: string;

    @ApiProperty({ description: '暱稱', example: '超人' })
    @IsString()
    @IsNotEmpty()
    @MinLength(REGISTER_REQUSER_VALIDATION.NICKNAME.MIN_LENGTH)
    @MaxLength(REGISTER_REQUSER_VALIDATION.NICKNAME.MAX_LENGTH)
    nickname: string;

    constructor(account: string, password: string, nickname: string) {
        this.account = account;
        this.password = password;
        this.nickname = nickname;
    }
}

interface RegisterServiceDto {
    nickname: string;
    account: string;
    token: string;
}

export type { RegisterDto, RegisterServiceDto };
