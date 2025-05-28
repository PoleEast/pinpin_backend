import { ApiProperty } from "@nestjs/swagger";
import { AvatarResponseDTO } from "pinpin_library";

class AvatarDTO implements AvatarResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "公共ID",
    example: "avatar_public_id_12345",
    required: true,
  })
  public_id: string;

  @ApiProperty({
    description: "類型",
    example: 0,
    required: true,
  })
  type: number;

  @ApiProperty({
    description: "建立時間",
    example: "2022-01-01T00:00:00.000Z",
    required: true,
  })
  create_at: Date;

  constructor(data: AvatarResponseDTO) {
    this.id = data.id;
    this.public_id = data.public_id;
    this.type = data.type;
    this.create_at = data.create_at;
  }
}

export default AvatarDTO;
