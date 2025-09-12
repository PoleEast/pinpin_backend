import { Injectable } from "@nestjs/common";
import { GoogleService } from "../google/google.service.js";
import { AutoCompletResponse, GetLocationByIdResponse, GoogleMapsPlacePriceLevel, Location, SearchLocationResponse } from "pinpin_library";
import {
  mapGoogleMapsPlaceAutocompleteResponseToAutoCompletResponseDto,
  mapGoogleMapsPlaceGetLocationResponseGetLocationByIdResponseDto,
  mapGoogleMapsPlaceTextSearchResponseToSearchLocationDto,
  reversePriceLevelMapper,
} from "../../common/mappers/index.js";
import { ConstObjectValues } from "../../common/utils/type.util.js";
import { ORIGINAL_GOOGLE_MAPS_PLACE } from "../../common/constants/constants.js";

//TODO:將地圖服務抽象化，實現依賴反轉
//TODO:將測試功能加入地圖服務的抽象層中

@Injectable()
export class SearchLocationService {
  constructor(private readonly googleService: GoogleService) {}

  async getTextSearchLocation(
    keyword: string,
    primaryType: string = "",
    priceLevel?: GoogleMapsPlacePriceLevel[],
    nextPageToken: string = "",
    pageSize: number = 12,
    maxImageHeight: number = 200,
  ): Promise<SearchLocationResponse> {
    // 將 Google Maps 的價格等級轉換為原始的價格等級
    const originalPriceLevels: ConstObjectValues<typeof ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL>[] =
      priceLevel?.map((level) => reversePriceLevelMapper(level)) || [];

    const response = await this.googleService.getTextSearch(keyword, primaryType, originalPriceLevels, nextPageToken, pageSize);

    if (!response.places || response.places.length === 0) {
      return { locations: [], nextPageToken: "" };
    }

    // 將 Google Maps 的地點轉換為自定義的地點 Dto
    //TODO: 實作型別守衛
    const locations: Location[] = await Promise.all(
      response.places
        .filter((place) => place.displayName?.text && place.id)
        .map(
          async (place): Promise<Location> =>
            mapGoogleMapsPlaceTextSearchResponseToSearchLocationDto(
              place,
              (name, width, height) => this.getPhotoURL(name, width, height),
              undefined,
              maxImageHeight,
            ),
        ),
    );

    const result: SearchLocationResponse = {
      locations: locations,
      nextPageToken: response.nextPageToken || "",
    };

    return result;
  }

  async getPhotoURL(photoName: string, maxImageWidth?: number, maxImageHeight: number = 200): Promise<string> {
    if (!photoName) {
      return "";
    }

    const fullPhotoName = photoName.concat("/media");
    return this.googleService.getPhoto(fullPhotoName, maxImageWidth, maxImageHeight);
  }

  getTestPhotoURL() {
    return "https://res.cloudinary.com/duynzu6ez/image/upload/v1748940979/Avatar/noidvqinf5vzjryzor6t.png";
  }

  /**
   * 取得自動完成的結果
   * @param keyword 關鍵字
   * @param sessionToken  Google Places API 的 session token
   * @param primaryTypes  地點類型
   * @returns  自動完成的結果
   */
  async getAutoComplete(keyword: string, sessionToken: string, primaryTypes?: string[]): Promise<AutoCompletResponse[]> {
    const response = await this.googleService.autocomplete(keyword, sessionToken, primaryTypes);

    if (!response.suggestions || response.suggestions.length === 0) {
      return [];
    }

    const result: AutoCompletResponse[] = response.suggestions
      .filter((suggestion) => suggestion.placePrediction?.placeId && suggestion.placePrediction?.structuredFormat)
      .map((suggestion) => mapGoogleMapsPlaceAutocompleteResponseToAutoCompletResponseDto(suggestion));

    return result;
  }

  async getLocationById(placeID: string, sessionToken?: string): Promise<GetLocationByIdResponse> {
    const response = await this.googleService.getLocationById(placeID, sessionToken);

    if (!response) {
      throw new Error("無效的地點ID");
    }

    const result: GetLocationByIdResponse = mapGoogleMapsPlaceGetLocationResponseGetLocationByIdResponseDto(response);

    return result;
  }
}
