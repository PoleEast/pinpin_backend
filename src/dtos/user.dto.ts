import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import {
  AccountRequestDTO,
  ACCOUNTSETTING_REQUSER_VALIDATION,
  LOGIN_REQUSER_VALIDATION,
  LoginRequestDTO,
  REGISTER_REQUSER_VALIDATION,
  RegisterRequestDTO,
  USERPROFILE_REQUSER_VALIDATION,
} from "pinpin_library";

class RegisterDto implements RegisterRequestDTO {
  @ApiProperty({
    description: "帳號",
    example: "superman",
    minLength: REGISTER_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH,
    maxLength: REGISTER_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(REGISTER_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH)
  @MaxLength(REGISTER_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH)
  @Matches(REGISTER_REQUSER_VALIDATION.ACCOUNT.PATTERN, {
    message: REGISTER_REQUSER_VALIDATION.ACCOUNT.PATTERN_MESSAGE,
  })
  account: string;

  @ApiProperty({
    description: "密碼",
    example: "123456",
    minLength: REGISTER_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: REGISTER_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(REGISTER_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH)
  @MaxLength(REGISTER_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH)
  password: string;

  @ApiProperty({
    description: "暱稱",
    example: "超人",
    minLength: REGISTER_REQUSER_VALIDATION.NICKNAME.MIN_LENGTH,
    maxLength: REGISTER_REQUSER_VALIDATION.NICKNAME.MAX_LENGTH,
    required: true,
  })
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

class LoginDto implements LoginRequestDTO {
  @ApiProperty({
    description: "帳號",
    example: "superman",
    minLength: LOGIN_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH,
    maxLength: LOGIN_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(LOGIN_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH)
  @MaxLength(LOGIN_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH)
  @Matches(LOGIN_REQUSER_VALIDATION.ACCOUNT.PATTERN, {
    message: LOGIN_REQUSER_VALIDATION.ACCOUNT.PATTERN_MESSAGE,
  })
  account: string;

  @ApiProperty({
    description: "密碼",
    example: "123456",
    minLength: LOGIN_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: LOGIN_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(LOGIN_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH)
  @MaxLength(LOGIN_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH)
  password: string;

  constructor(account: string, password: string) {
    this.account = account;
    this.password = password;
  }
}

class AccountDTO implements AccountRequestDTO {
  @ApiProperty({
    description: "帳號",
    example: "superman",
    minLength: ACCOUNTSETTING_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH,
    maxLength: ACCOUNTSETTING_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(ACCOUNTSETTING_REQUSER_VALIDATION.ACCOUNT.MIN_LENGTH)
  @MaxLength(ACCOUNTSETTING_REQUSER_VALIDATION.ACCOUNT.MAX_LENGTH)
  @IsOptional()
  account?: string;

  @ApiProperty({
    description: "密碼",
    example: "123456",
    minLength: ACCOUNTSETTING_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: ACCOUNTSETTING_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(ACCOUNTSETTING_REQUSER_VALIDATION.PASSWORD.MIN_LENGTH)
  @MaxLength(ACCOUNTSETTING_REQUSER_VALIDATION.PASSWORD.MAX_LENGTH)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: "電子郵件",
    example: "M9TlM@example.com",
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.EMAIL.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.EMAIL.MAX_LENGTH)
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "建立時間",
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  createAt?: Date;
}

interface RegisterServiceDto {
  nickname: string;
  account: string;
  token: string;
}

interface LoginServiceDto {
  nickname: string;
  account: string;
  token: string;
}

export type { RegisterServiceDto, LoginServiceDto };
export { RegisterDto, LoginDto, AccountDTO };
