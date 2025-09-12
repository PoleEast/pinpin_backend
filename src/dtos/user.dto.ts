import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { AccountRequest, LoginRequest, RegisterRequest, USERPROFILE_REQUSER_VALIDATION, USER_VALIDATION } from "pinpin_library";

class RegisterDto implements RegisterRequest {
  @ApiProperty({
    description: "帳號",
    example: "superman",
    minLength: USER_VALIDATION.ACCOUNT.MIN_LENGTH,
    maxLength: USER_VALIDATION.ACCOUNT.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(USER_VALIDATION.ACCOUNT.MIN_LENGTH)
  @MaxLength(USER_VALIDATION.ACCOUNT.MAX_LENGTH)
  @Matches(USER_VALIDATION.ACCOUNT.PATTERN)
  account: string;

  @ApiProperty({
    description: "密碼",
    example: "123456",
    minLength: USER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: USER_VALIDATION.PASSWORD.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(USER_VALIDATION.PASSWORD.MIN_LENGTH)
  @MaxLength(USER_VALIDATION.PASSWORD.MAX_LENGTH)
  password: string;

  @ApiProperty({
    description: "暱稱",
    example: "超人",
    minLength: USERPROFILE_REQUSER_VALIDATION.NICKNAME.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.NICKNAME.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.NICKNAME.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.NICKNAME.MAX_LENGTH)
  nickname: string;

  constructor(account: string, password: string, nickname: string) {
    this.account = account;
    this.password = password;
    this.nickname = nickname;
  }
}

class LoginDto implements LoginRequest {
  @ApiProperty({
    description: "帳號",
    example: "superman",
    minLength: USER_VALIDATION.ACCOUNT.MIN_LENGTH,
    maxLength: USER_VALIDATION.ACCOUNT.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(USER_VALIDATION.ACCOUNT.MIN_LENGTH)
  @MaxLength(USER_VALIDATION.ACCOUNT.MAX_LENGTH)
  @Matches(USER_VALIDATION.ACCOUNT.PATTERN)
  account: string;

  @ApiProperty({
    description: "密碼",
    example: "123456",
    minLength: USER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: USER_VALIDATION.PASSWORD.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(USER_VALIDATION.PASSWORD.MIN_LENGTH)
  @MaxLength(USER_VALIDATION.PASSWORD.MAX_LENGTH)
  password: string;

  constructor(account: string, password: string) {
    this.account = account;
    this.password = password;
  }
}

class AccountDto implements AccountRequest {
  @ApiProperty({
    description: "帳號",
    example: "superman",
    minLength: USER_VALIDATION.ACCOUNT.MIN_LENGTH,
    maxLength: USER_VALIDATION.ACCOUNT.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USER_VALIDATION.ACCOUNT.MIN_LENGTH)
  @MaxLength(USER_VALIDATION.ACCOUNT.MAX_LENGTH)
  @IsOptional()
  account?: string;

  @ApiProperty({
    description: "密碼",
    example: "123456",
    minLength: USER_VALIDATION.PASSWORD.MIN_LENGTH,
    maxLength: USER_VALIDATION.PASSWORD.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @ValidateIf((o) => o.password !== "")
  @MinLength(USER_VALIDATION.PASSWORD.MIN_LENGTH)
  @MaxLength(USER_VALIDATION.PASSWORD.MAX_LENGTH)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: "電子郵件",
    example: "M9TlM@example.com",
    required: false,
  })
  @IsString()
  @ValidateIf((o) => o.email !== "")
  @MinLength(USERPROFILE_REQUSER_VALIDATION.EMAIL.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.EMAIL.MAX_LENGTH)
  @IsOptional()
  @IsEmail({}, { message: "電子郵件格式錯誤" })
  email?: string;
}

export { RegisterDto, LoginDto, AccountDto };
