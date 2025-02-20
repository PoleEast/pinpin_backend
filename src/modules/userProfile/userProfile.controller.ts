import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserProfileService } from "./userProfile.service.js";
import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { JwtGuard } from "../../common/guards/jwt.guard.js";

@Controller("users")
@ApiTags("user")
export class UserProfileController {
  constructor(private readonly userService: UserProfileService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶個人資料修改" })
  @ApiCommonResponses(HttpStatus.OK, "用戶個人資料修改成功")
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Post("updateUserProfile")
  async updateUserProfile() {}
}
