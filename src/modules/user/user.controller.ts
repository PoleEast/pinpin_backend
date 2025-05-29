import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Patch, Post, Res, UseGuards } from "@nestjs/common";

import { AccountDTO, LoginDto, RegisterDto } from "../../dtos/user.dto.js";
import { UserService } from "./user.service.js";
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import ApiCommonResponses from "../../common/decorators/api_responses.decorator.js";
import { AccountRequestDTO, ApiResponseDTO, LoginResponseDTO } from "pinpin_library";
import { Response } from "express";
import { JwtGuard } from "../../common/guards/jwt.guard.js";
import GetUser from "../../common/decorators/get-user.decorator.js";
import { User } from "../../entities/user.entity.js";

@ApiTags("用戶")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "註冊用戶" })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "帳號已經存在",
  })
  @ApiCommonResponses(HttpStatus.CREATED, "註冊成功")
  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response): Promise<ApiResponseDTO<LoginResponseDTO>> {
    const result = await this.userService.Register(registerDto);

    //設定cookie
    this.setCookie(response, result.token);

    return {
      statusCode: HttpStatus.CREATED,
      message: "註冊成功",
      data: {
        nickname: result.nickname,
        avatar_public_id: result.avatar_public_id,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "登入用戶" })
  @ApiCommonResponses(HttpStatus.OK, "登入成功")
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "帳號或密碼錯誤",
  })
  @Post("login")
  async Login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<ApiResponseDTO<LoginResponseDTO>> {
    const result = await this.userService.Login(loginDto);

    //設定cookie
    this.setCookie(response, result.token);

    return {
      statusCode: HttpStatus.CREATED,
      message: "登入成功",
      data: {
        nickname: result.nickname,
        avatar_public_id: result.avatar_public_id,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "登出用戶", description: "清除token" })
  @ApiCommonResponses(HttpStatus.OK, "登出成功")
  @Get("logout")
  async logout(@Res({ passthrough: true }) response: Response): Promise<ApiResponseDTO> {
    response.clearCookie("access_token");
    return {
      statusCode: HttpStatus.OK,
      message: "登出成功",
    };
  }

  @ApiOperation({ summary: "驗證token" })
  @ApiCommonResponses(HttpStatus.OK, "授權成功")
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Get("check-auth")
  async CheckAuth(@GetUser() user: User): Promise<ApiResponseDTO<LoginResponseDTO>> {
    return {
      statusCode: HttpStatus.OK,
      message: "授權成功",
      data: {
        nickname: user.profile.nickname,
        avatar_public_id: user.profile.avatar.public_id,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶個人資料修改" })
  @ApiCommonResponses(HttpStatus.OK, "用戶個人資料修改成功")
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Patch("updateUser")
  async updateUserProfile(@GetUser() user: User, @Body() accountDTO: AccountDTO): Promise<ApiResponseDTO<AccountRequestDTO>> {
    const result = await this.userService.updateUser(user, accountDTO);

    return {
      statusCode: HttpStatus.OK,
      message: "用戶個人資料修改成功",
      data: result,
    };
  }

  /**
   * 設定cookie
   * @param response express response
   * @param token jwt token
   */
  private setCookie(response: Response, token: string) {
    response.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
