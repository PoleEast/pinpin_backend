import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { autoCompletResponseeDTO, IsearchLocationDTO, IsearchLocationResponseDTO } from "pinpin_library";

class autoCompleteDTO implements autoCompletResponseeDTO {
  @ApiProperty({
    description: "地點ID",
    example: "ChIJa0aM2VU8j4AR8QrX5A9M4b4",
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places/autocomplete?hl=zh-tw",
    },
  })
  placeId: string;

  @ApiProperty({
    description: "類型",
    maxItems: 5,
    example: ["airport", "shopping_mall"],
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places/autocomplete?hl=zh-tw",
    },
  })
  types: string[];

  @ApiProperty({
    description: "名稱",
    example: "台北101",
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places/autocomplete?hl=zh-tw",
    },
  })
  text: string;

  @ApiProperty({
    description: "所在地",
    example: "台北市",
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places/autocomplete?hl=zh-tw",
    },
  })
  address: string;
}

class locationDTO implements IsearchLocationDTO {
  @ApiProperty({
    description: "電話",
    example: "02-1234-5678",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  name: string;

  @ApiProperty({
    description: "地點ID",
    example: "ChIJa0aM2VU8j4AR8QrX5A9M4b4",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  id: string;

  @ApiProperty({
    description: "地址",
    example: "台北市大安區忠孝東路四段",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  address: string;

  @ApiProperty({
    description: "電話",
    example: "02-1234-5678",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  phoneNumber: string;

  @ApiProperty({
    description: "類型",
    example: "restaurant",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  primaryType: string;

  @ApiProperty({
    description: "營業狀態",
    example: "OPEN",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  businessStatus: "OPEN" | "CLOSE" | "UNKNOWN";

  @ApiProperty({
    description: "評分",
    example: 4.5,
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  rating: number;

  @ApiProperty({
    description: "價位等級",
    example: "INEXPENSIVE",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  priceLevel: "INEXPENSIVE" | "MODERATE" | "EXPENSIVE" | "VERY_EXPENSIVE" | "UNKNOWN";

  @ApiProperty({
    description: "評分數",
    example: 4.5,
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  userRatingCount: number;

  @ApiProperty({
    description: "照片id",
    example: "ChIJJa0aM2VU8j4AR8QrX5A9M4b4",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  photo: string;
}

class searchLocationDTO implements IsearchLocationResponseDTO {
  @ApiProperty({
    description: "地點列表",
    type: [locationDTO],
  })
  @Type(() => autoCompleteDTO)
  locations: locationDTO[];

  @ApiProperty({
    description: "下一頁的令牌",
    example: "ChIJJa0aM2VU8j4AR8QrX5A9M4b4",
    required: false,
  })
  nextPageToken: string;
}

export { autoCompleteDTO, searchLocationDTO, locationDTO };
