import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsIn, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { USERPROFILE_REQUSER_VALIDATION, UserProfileResponseDTO } from "pinpin_library";
import { AccountDTO } from "./user.dto.js";

class UserProfileDto implements UserProfileResponseDTO {
  @ApiProperty({
    description: "座右銘",
    example: "我是超人",
    minLength: USERPROFILE_REQUSER_VALIDATION.MOTTO.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.MOTTO.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.MOTTO.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.MOTTO.MAX_LENGTH)
  @IsOptional()
  motto?: string;

  @ApiProperty({
    description: "自我介紹",
    example: "我是超人",
    minLength: USERPROFILE_REQUSER_VALIDATION.BIO.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.BIO.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.BIO.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.BIO.MAX_LENGTH)
  @IsOptional()
  bio?: string;

  @ApiProperty({
    description: "真實姓名",
    example: "克拉克·肯特",
    minLength: USERPROFILE_REQUSER_VALIDATION.FULLNAME.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.FULLNAME.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.FULLNAME.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.FULLNAME.MAX_LENGTH)
  @IsOptional()
  fullname?: string;

  @ApiProperty({
    description: "暱稱",
    example: "超人",
    minLength: USERPROFILE_REQUSER_VALIDATION.NICKNAME.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.NICKNAME.MAX_LENGTH,
    required: true,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.NICKNAME.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.NICKNAME.MAX_LENGTH)
  nickname!: string;

  @ApiProperty({
    description: "是否顯示姓名",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFullNameVisible?: boolean;

  @ApiProperty({
    description: "頭像id",
    example: "superman",
    minLength: USERPROFILE_REQUSER_VALIDATION.AVATAR.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.AVATAR.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.AVATAR.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.AVATAR.MAX_LENGTH)
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    description: "封面照id",
    example: "supermanBackground",
    minLength: USERPROFILE_REQUSER_VALIDATION.COVERPHOTO.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.COVERPHOTO.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.COVERPHOTO.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.COVERPHOTO.MAX_LENGTH)
  @IsOptional()
  coverPhoto?: string;

  @ApiProperty({
    description: "生日",
    example: "1990-01-01",
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({
    description: "性別",
    example: 1,
    required: false,
  })
  @IsIn(USERPROFILE_REQUSER_VALIDATION.GENDER.VALUES)
  @IsOptional()
  gender?: number;

  @ApiProperty({
    description: "手機號碼",
    example: "0912345678",
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.PHONE.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.PHONE.MAX_LENGTH)
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: "地址",
    example: "台北市",
    minLength: USERPROFILE_REQUSER_VALIDATION.ADDRESS.MIN_LENGTH,
    maxLength: USERPROFILE_REQUSER_VALIDATION.ADDRESS.MAX_LENGTH,
    required: false,
  })
  @IsString()
  @MinLength(USERPROFILE_REQUSER_VALIDATION.ADDRESS.MIN_LENGTH)
  @MaxLength(USERPROFILE_REQUSER_VALIDATION.ADDRESS.MAX_LENGTH)
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: "出生地",
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  originCountry?: number;

  @ApiProperty({
    description: "訪問過的國家",
    required: false,
    example: [1, 2, 3],
  })
  @IsArray({ message: "訪問過的國家必須為陣列" })
  @IsNumber({}, { each: true, message: "訪問過的國家必須為數字" })
  @IsOptional()
  visitedCountries?: number[];

  @ApiProperty({
    description: "語言",
    required: false,
    example: [1, 2, 3],
  })
  @IsArray({ message: "語言必須為陣列" })
  @IsNumber({}, { each: true, message: "語言必須為數字" })
  @IsOptional()
  language?: number[];

  @ApiProperty({
    description: "貨幣",
    required: false,
    example: [1, 2, 3],
  })
  @IsArray({ message: "貨幣必須為陣列" })
  @IsNumber({}, { each: true, message: "貨幣必須為數字" })
  @IsOptional()
  currency?: number[];

  @ApiProperty({
    description: "旅遊興趣",
    required: false,
    example: [1, 2, 3],
  })
  @IsArray({ message: "旅遊興趣必須為陣列" })
  @IsNumber({}, { each: true, message: "旅遊興趣必須為數字" })
  @IsOptional()
  travelInterest?: number[];

  @ApiProperty({
    description: "旅遊風格",
    required: false,
    example: [1, 2, 3],
  })
  @IsArray({ message: "旅遊風格必須為陣列" })
  @IsNumber({}, { each: true, message: "旅遊風格必須為數字" })
  @IsOptional()
  travelStyle?: number[];

  @ApiProperty({
    description: "帳戶資料",
    required: false,
  })
  @ValidateNested()
  @Type(() => AccountDTO)
  @IsOptional()
  user?: AccountDTO;
}

export { UserProfileDto };
