import { ApiProperty } from "@nestjs/swagger";
import { CountryResponseDTO } from "pinpin_library";

class CountryDTO implements CountryResponseDTO {
  @ApiProperty({
    description: "國家代碼",
    example: "TW",
    required: true,
  })
  code: string;

  @ApiProperty({
    description: "國家電話區碼",
    example: 886,
    required: true,
  })
  dial_code: number;

  @ApiProperty({
    description: "國家英文名稱",
    example: "Taiwan",
    required: true,
  })
  english_name: string;

  @ApiProperty({
    description: "國家本地名稱",
    example: "台灣",
    required: true,
  })
  local_name: string;

  @ApiProperty({
    description: "國家圖示",
    example: "flag-icon-tw",
    required: true,
  })
  icon: string;

  constructor(data: CountryResponseDTO) {
    this.code = data.code;
    this.dial_code = data.dial_code;
    this.english_name = data.english_name;
    this.local_name = data.local_name;
    this.icon = data.icon;
  }
}

export { CountryDTO };
