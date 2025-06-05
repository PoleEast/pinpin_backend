import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AvatarService } from "./avatar.service.js";
import ApiCommonResponses, { ApiResponseDTO } from "../../common/decorators/api_responses.decorator.js";
import { JwtGuard } from "../../common/guards/jwt.guard.js";
import { FileInterceptor } from "@nestjs/platform-express";
import GetUser from "../../common/decorators/get-user.decorator.js";
import { User } from "../../entities/user.entity.js";
import AvatarDTO from "../../dtos/avatar.dto.js";
import { AvatarResponseDTO } from "pinpin_library";

@ApiTags("頭像")
@Controller("avatar")
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "預設頭像獲取" })
  @ApiCommonResponses(HttpStatus.OK, "預設頭像獲取成功", AvatarDTO)
  @Get("getDefaultAvatar")
  async getDefaultAvatar(): Promise<ApiResponseDTO<AvatarDTO[]>> {
    const result = await this.avatarService.getDefaultAvatar();

    return {
      statusCode: HttpStatus.OK,
      message: "預設頭像獲取成功",
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "用戶頭像獲取" })
  @ApiCommonResponses(HttpStatus.OK, "用戶頭像獲取成功", AvatarDTO)
  @ApiCookieAuth()
  @UseGuards(JwtGuard)
  @Get("getUserAvatar")
  async getUserAvatar(@GetUser() user: User): Promise<ApiResponseDTO<AvatarDTO[]>> {
    const result = await this.avatarService.getUserAvatar(user);

    return {
      statusCode: HttpStatus.OK,
      message: "用戶頭像獲取成功",
      data: result,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "用戶頭像上傳" })
  @ApiCommonResponses(HttpStatus.CREATED, "用戶頭像上傳成功", AvatarDTO)
  @ApiCookieAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "用戶頭像圖片 (支援 jpeg, jpg, png, gif 格式)",
        },
      },
      required: ["file"],
    },
  })
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor("avatar", {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpeg|jpg|png|gif|webp)$/)) {
          return cb(new BadRequestException("不支援的檔案格式"), false);
        }
        return cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
      },
    }),
  )
  @Post("upload")
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @GetUser() user: User): Promise<ApiResponseDTO<AvatarResponseDTO>> {
    if (!file) {
      throw new BadRequestException("請上傳檔案");
    }
    const result = await this.avatarService.uploadAvatar(file, user);

    return {
      statusCode: HttpStatus.CREATED,
      message: "用戶頭像上傳成功",
      data: result,
    };
  }
}
