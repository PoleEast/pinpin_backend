import { ApiProperty } from "@nestjs/swagger";
import {
  CountryResponseDTO,
  CurrencyResponseDTO,
  LanguageResponseDTO,
  SettingResponseDTO,
  TravelInterestsResponseDTO,
  TravelInterestTypeResponseDTO,
  TravelStyleResponseDTO,
} from "pinpin_library";

class CountryDTO implements CountryResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

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
    this.id = data.id;
    this.code = data.code;
    this.dial_code = data.dial_code;
    this.english_name = data.english_name;
    this.local_name = data.local_name;
    this.icon = data.icon;
  }
}

class CurrencyDTO implements CurrencyResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "貨幣代碼",
    example: "TWD",
    required: true,
  })
  code: string;

  @ApiProperty({
    description: "貨幣圖標",
    example: "dollar-sign",
    required: true,
  })
  icon: string;

  constructor(data: CurrencyResponseDTO) {
    this.id = data.id;
    this.code = data.code;
    this.icon = data.icon;
  }
}

class LanguageDTO implements LanguageResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "語言代碼",
    example: "zh-TW",
    required: true,
  })
  english_name: string;

  @ApiProperty({
    description: "語言代碼",
    example: "zh-TW",
    required: true,
  })
  local_name: string;

  constructor(data: LanguageResponseDTO) {
    this.id = data.id;
    this.english_name = data.english_name;
    this.local_name = data.local_name;
  }
}

class TravelInterestTypeDTO implements TravelInterestTypeResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "名稱",
    example: "文化探索",
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "顏色",
    example: "indigo",
    required: true,
  })
  color: string;

  @ApiProperty({
    description: "旅遊型態編號",
    example: [1, 2],
    required: true,
  })
  travel_interests: number[];

  constructor(data: TravelInterestTypeResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.travel_interests = data.travel_interests;
  }
}

class travelInterestDTO implements TravelInterestsResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "名稱",
    example: "古蹟巡禮",
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "圖標",
    example: "fa-landmark",
    required: true,
  })
  icon: string;

  constructor(data: TravelInterestsResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
  }
}

class TravelStyleDTO implements TravelStyleResponseDTO {
  @ApiProperty({
    description: "編號",
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: "名稱",
    example: "奢華",
    required: true,
  })
  name: string;

  @ApiProperty({
    description: "描述",
    example: "高端、奢華的旅行體驗，享受頂級服務",
    required: true,
  })
  description: string;

  @ApiProperty({
    description: "圖標",
    example: "fa-gem",
    required: true,
  })
  icon: string;

  @ApiProperty({
    description: "顏色",
    example: "amber",
    required: true,
  })
  color: string;

  constructor(data: TravelStyleResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon;
    this.color = data.color;
  }
}

class SettingDTO implements SettingResponseDTO {
  @ApiProperty({
    description: "國家資料",
    example: [
      {
        id: 1,
        code: "TW",
        dial_code: 886,
        english_name: "Taiwan",
        local_name: "台灣",
      },
    ],
    required: true,
  })
  country: CountryResponseDTO[];

  @ApiProperty({
    description: "貨幣資料",
    example: [
      {
        id: 1,
        code: "TWD",
        icon: "dollar-sign",
      },
    ],
    required: true,
  })
  currency: CurrencyResponseDTO[];

  @ApiProperty({
    description: "語言資料",
    example: [
      {
        id: 1,
        english_name: "zh-TW",
        local_name: "中文",
      },
    ],
    required: true,
  })
  language: LanguageResponseDTO[];

  @ApiProperty({
    description: "旅遊類型資料",
    example: [
      {
        id: 1,
        name: "文化探索",
        color: "indigo",
        travel_interests: [1, 2],
      },
    ],
    required: true,
  })
  travelInterestType: TravelInterestTypeResponseDTO[];

  @ApiProperty({
    description: "旅遊興趣資料",
    example: [
      {
        id: 1,
        name: "古蹟巡禮",
        icon: "fa-landmark",
      },
    ],
    required: true,
  })
  travelInterest: TravelInterestsResponseDTO[];

  @ApiProperty({
    description: "旅遊風格資料",
    example: [
      {
        id: 1,
        name: "奢華",
        description: "高端、奢華的旅行體驗，享受頂級服務",
        icon: "fa-gem",
        color: "amber",
      },
    ],
  })
  travelStyle: TravelInterestsResponseDTO[];

  constructor(data: SettingResponseDTO) {
    this.country = data.country;
    this.currency = data.currency;
    this.language = data.language;
    this.travelInterestType = data.travelInterestType;
    this.travelInterest = data.travelInterest;
    this.travelStyle = data.travelStyle;
  }
}

export { CountryDTO, CurrencyDTO, LanguageDTO, TravelInterestTypeDTO, travelInterestDTO, TravelStyleDTO, SettingDTO };
