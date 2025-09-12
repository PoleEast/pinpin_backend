import { ApiProperty } from "@nestjs/swagger";
import {
  CountryResponse,
  CurrencyResponse,
  LanguageResponse,
  SettingResponse,
  TravelInterestsResponse,
  TravelInterestTypeResponse,
  TravelStyleResponse,
} from "pinpin_library";

class CountryDto implements CountryResponse {
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

  @ApiProperty({
    description: "圖示類型",
    example: "fontawesome",
    required: true,
  })
  icon_type: string;

  constructor(data: CountryResponse) {
    this.id = data.id;
    this.code = data.code;
    this.dial_code = data.dial_code;
    this.english_name = data.english_name;
    this.local_name = data.local_name;
    this.icon = data.icon;
    this.icon_type = data.icon_type;
  }
}

class CurrencyDto implements CurrencyResponse {
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

  @ApiProperty({
    description: "圖示類型",
    example: "fontawesome",
    required: true,
  })
  icon_type: string;

  constructor(data: CurrencyResponse) {
    this.id = data.id;
    this.code = data.code;
    this.icon = data.icon;
    this.icon_type = data.icon_type;
  }
}

class LanguageDto implements LanguageResponse {
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

  constructor(data: LanguageResponse) {
    this.id = data.id;
    this.english_name = data.english_name;
    this.local_name = data.local_name;
  }
}

class TravelInterestTypeDto implements TravelInterestTypeResponse {
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

  constructor(data: TravelInterestTypeResponse) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.travel_interests = data.travel_interests;
  }
}

class travelInterestDto implements TravelInterestsResponse {
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

  @ApiProperty({
    description: "圖示類型",
    example: "fontawesome",
    required: true,
  })
  icon_type: string;

  constructor(data: TravelInterestsResponse) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.icon_type = data.icon_type;
  }
}

class TravelStyleDto implements TravelStyleResponse {
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
    description: "圖示類型",
    example: "fontawesome",
    required: true,
  })
  icon_type: string;

  @ApiProperty({
    description: "顏色",
    example: "amber",
    required: true,
  })
  color: string;

  constructor(data: TravelStyleResponse) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.icon = data.icon;
    this.icon_type = data.icon_type;
    this.color = data.color;
  }
}

class SettingDto implements SettingResponse {
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
  country: CountryResponse[];

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
  currency: CurrencyResponse[];

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
  language: LanguageResponse[];

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
  travelInterestType: TravelInterestTypeResponse[];

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
  travelInterest: TravelInterestsResponse[];

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
  travelStyle: TravelInterestsResponse[];

  constructor(data: SettingResponse) {
    this.country = data.country;
    this.currency = data.currency;
    this.language = data.language;
    this.travelInterestType = data.travelInterestType;
    this.travelInterest = data.travelInterest;
    this.travelStyle = data.travelStyle;
  }
}

export { CountryDto, CurrencyDto, LanguageDto, TravelInterestTypeDto, travelInterestDto, TravelStyleDto, SettingDto };
