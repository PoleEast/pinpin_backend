import { AvatarChangeHistoryResponse } from "pinpin_library";
import AvatarDto from "./avatar.dto.js";
import { ApiProperty } from "@nestjs/swagger";

class AvatarChangeHistoryDto implements AvatarChangeHistoryResponse {
  @ApiProperty({ description: "編號", example: 1, required: true })
  id: number;
  @ApiProperty({
    description: "頭像列表",
    type: AvatarDto,
  })
  avatar: AvatarDto;
  @ApiProperty({ description: "變更日期", example: "2022-01-01T00:00:00.000Z", required: true })
  change_date: Date;
}

export default AvatarChangeHistoryDto;
