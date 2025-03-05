import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserProfileService } from "./userProfile.service.js";
import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { JwtGuard } from "../../common/guards/jwt.guard.js";
import GetUser from "../../common/decorators/get-user.decorator.js";
import { User } from "../../entities/user.entity.js";
import { ApiResponseDTO, UserProfileResponseDTO } from "pinpin_library";
import { UserProfileDto } from "../../dtos/userProfile.dto.js";

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
  async getUserProfile(@GetUser() user: User): Promise<ApiResponseDTO<UserProfileResponseDTO>> {
    const result = await this.userProfileService.getUserProfile(user.id);

    const ApiResponse: ApiResponseDTO<UserProfileDto> = {
      statusCode: HttpStatus.OK,
      message: "用戶個人資料查詢成功",
      data: result,
    };

    return ApiResponse;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶個人資料修改" })
  @ApiCommonResponses(HttpStatus.OK, "用戶個人資料修改成功")
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Post("updateUserProfile")
  async updateUserProfile() {}
}
