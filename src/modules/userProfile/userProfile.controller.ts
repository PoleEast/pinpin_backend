import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserProfileService } from "./userProfile.service.js";
import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { JwtGuard } from "../../common/guards/jwt.guard.js";
import GetUser from "../../common/decorators/get-user.decorator.js";
import { User } from "../../entities/user.entity.js";
import { ApiResponse, AvatarChangeHistoryResponse, AvatarResponse, UserProfileResponse } from "pinpin_library";
import { UserProfileDto } from "../../dtos/userProfile.dto.js";
import AvatarChangeHistoryDto from "../../dtos/avatarChangeHistory.dto.js";
import AvatarDto from "../../dtos/avatar.dto.js";

@ApiTags("用戶個人資料")
@Controller("userProfile")
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶個人資料查詢" })
  @ApiCommonResponses(HttpStatus.OK, "用戶個人資料查詢成功", UserProfileDto)
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Get("getUserProfile")
  async getUserProfile(@GetUser() user: User): Promise<ApiResponse<UserProfileResponse>> {
    const result = await this.userProfileService.getUserProfile(user.id);

    const apiResponse: ApiResponse<UserProfileDto> = {
      statusCode: HttpStatus.OK,
      message: "用戶個人資料查詢成功",
      data: result,
    };

    return apiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶頭像變更歷史查詢" })
  @ApiCommonResponses(HttpStatus.OK, "用戶頭像變更歷史查詢成功", AvatarChangeHistoryDto)
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Get("getChangeHistoryAvatar")
  async getChangeHistoryAvatar(@GetUser() user: User): Promise<ApiResponse<AvatarChangeHistoryResponse[]>> {
    const result = await this.userProfileService.getChangeHistoryAvatar(user.id);

    return {
      statusCode: HttpStatus.OK,
      message: "用戶頭像變更歷史查詢成功",
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶個人資料更新" })
  @ApiCommonResponses(HttpStatus.OK, "用戶個人資料更新成功", UserProfileDto)
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Patch("updateUserProfile")
  async updateUserProfile(@GetUser() user: User, @Body() UserProfileDto: UserProfileDto): Promise<ApiResponse<UserProfileResponse>> {
    const result = await this.userProfileService.updateUserProfile(user.id, UserProfileDto);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      statusCode: HttpStatus.OK,
      message: "用戶個人資料更新成功",
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶頭像變更" })
  @ApiCommonResponses(HttpStatus.OK, "頭像變更成功", AvatarDto)
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Patch("updateAvatar")
  async updateAvatar(@GetUser() user: User, @Body("avatar_id") avatarId: number): Promise<ApiResponse<AvatarResponse>> {
    const result = await this.userProfileService.updateAvatar(user.id, avatarId);

    return {
      statusCode: HttpStatus.OK,
      message: "頭像變更成功",
      data: result,
    };
  }
}
