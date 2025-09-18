import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  AutoCompletResponse,
  GetLocationByIdResponse,
  OpeningTimePeriods,
  PriceRange,
  Review,
  Location,
  SearchLocationResponse,
  TimeOfDay,
  Coordinates,
} from "pinpin_library";
import { CoordinatesDto, TimeOfDayDto } from "./common.dto.js";

class AutoCompleteDto implements AutoCompletResponse {
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

class LocationDto implements Location {
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
  photoURL: string;

  @ApiProperty({
    description: "Icon的URL",
    example: "https://maps.gstatic.com/mapfiles/place_api/icons/v2/cafe_pinlet.png",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/icons?hl=zh_TW#places-api-new",
    },
  })
  IconMaskBaseURL: string;
}

class SearchLocationDto implements SearchLocationResponse {
  @ApiProperty({
    description: "地點列表",
    type: [LocationDto],
  })
  @Type(() => LocationDto)
  locations: Location[];

  @ApiProperty({
    description: "下一頁的令牌",
    example: "ChIJJa0aM2VU8j4AR8QrX5A9M4b4",
    required: false,
  })
  nextPageToken: string;
}

class OpeningTimePeriodsDto implements OpeningTimePeriods {
  @ApiProperty({ description: "營業時間", type: TimeOfDayDto })
  open: TimeOfDay;

  @ApiProperty({ description: "關店時間", type: TimeOfDayDto })
  close: TimeOfDay;

  @ApiProperty({ description: "星期幾", example: [0, 1, 2, 3, 4, 5, 6] })
  day: number[];
}

class ReviewDto implements Review {
  @ApiProperty({ description: "評論者名稱", example: "John Doe" })
  reviewerDisplayName: string;

  @ApiProperty({ description: "評論者頭像", example: "https://example.com/avatar.jpg" })
  photoUri: string;

  @ApiProperty({ description: "評論時間", example: "2023-10-01T12:34:56Z" })
  time: string;

  @ApiProperty({ description: "評分", example: 4.5 })
  rating: number;

  @ApiProperty({ description: "評論內容", example: "Great place!" })
  text: string;
}

class PriceRangeDto implements PriceRange {
  @ApiProperty({ description: "最低價", example: 10 })
  min: string;

  @ApiProperty({ description: "最高價", example: 100 })
  max: string;

  @ApiProperty({ description: "貨幣代碼", example: "TWD" })
  currencyCode: string;
}

class GetLocationByIdDto extends LocationDto implements GetLocationByIdResponse {
  @ApiProperty({ description: "地點座標", type: CoordinatesDto })
  location: Coordinates;

  @ApiProperty({
    description: "Google Maps 的網址",
    example: "https://maps.google.com/?cid=10281119596374313554",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
  })
  googleMapsUri: string;

  @ApiProperty({
    description: "店家網站",
    example: "https://www.example.com",
    externalDocs: {
      description: "REST Resource: places",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#resource:-place",
    },
    required: false,
  })
  website?: string;

  @ApiProperty({ description: "營業時間", type: [OpeningTimePeriodsDto] })
  openingTimePeriods: OpeningTimePeriods[];

  @ApiProperty({ description: "評論", type: [ReviewDto] })
  reviews: Review[];

  @ApiProperty({ description: "價位範圍", type: PriceRangeDto })
  priceRange: PriceRange;

  @ApiProperty({
    description: "時區",
    example: "Asia/Taipei",
    externalDocs: {
      description: "Google Time Zone API",
      url: "https://developers.google.com/maps/documentation/timezone/overview?hl=zh-tw",
    },
  })
  timeZone: string;

  @ApiProperty({
    description: "國家",
    example: "Taiwan",
    externalDocs: {
      description: "Google Places Address Components",
      url: "https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places?hl=zh-tw#addresscomponent",
    },
  })
  country: string;
}

export { AutoCompleteDto, SearchLocationDto, GetLocationByIdDto, OpeningTimePeriodsDto, ReviewDto, PriceRangeDto, LocationDto };
