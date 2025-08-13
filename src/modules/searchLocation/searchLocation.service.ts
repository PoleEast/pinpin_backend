import { Injectable } from "@nestjs/common";
import { GoogleService } from "../google/google.service.js";
import { autoCompletResponseeDTO, GoogleMapsPlacePriceLevel, IsearchLocationDTO, IsearchLocationResponseDTO } from "pinpin_library";
import { googleBusinessStatusMapper, googlePriceLevelMapper, reversePriceLevelMapper } from "../../common/mappers/index.js";
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
  ): Promise<IsearchLocationResponseDTO> {
    // 將 Google Maps 的價格等級轉換為原始的價格等級
    const originalPriceLevels: ConstObjectValues<typeof ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL>[] =
      priceLevel?.map((level) => reversePriceLevelMapper(level)) || [];

    const response = await this.googleService.getTextSearch(keyword, primaryType, originalPriceLevels, nextPageToken, pageSize);
    // const response = await this.googleService.getTestSearchLocation(keyword, primaryType, originalPriceLevels, nextPageToken, pageSize);
    // 如果沒有找到任何地點，返回空的結果
    if (!response.places || response.places.length === 0) {
      return { locations: [], nextPageToken: "" };
    }

    // 將 Google Maps 的地點轉換為自定義的地點 DTO
    //TODO: 實作型別守衛
    const locations: IsearchLocationDTO[] = await Promise.all(
      response.places
        .filter((place) => place.displayName?.text && place.id)
        .map(
          async (place): Promise<IsearchLocationDTO> => ({
            phoneNumber: place.internationalPhoneNumber || "",
            rating: place.rating || 0,
            businessStatus: googleBusinessStatusMapper(place.businessStatus),
            priceLevel: googlePriceLevelMapper(place.priceLevel),
            userRatingCount: place.userRatingCount || 0,
            name: place.displayName?.text || "",
            primaryType: place.primaryType || "",
            address: place.shortFormattedAddress || "",
            id: place.id || "",
            // photoURL: place.photos?.[0].name ? await this.getPhotoURL(place.photos[0].name, undefined, maxImageHeight) : "",
            photoURL: this.getTestPhotoURL(),
            IconMaskBaseURL: place.iconMaskBaseUri + ".svg" || "",
          }),
        ),
    );

    const result: IsearchLocationResponseDTO = {
      locations: locations,
      nextPageToken: response.nextPageToken || "",
    };

    return result;
  }

  async getPhotoURL(photoName?: string, maxImageWidth?: number, maxImageHeight: number = 200): Promise<string> {
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
  async getAutoComplete(keyword: string, sessionToken: string, primaryTypes?: string[]): Promise<autoCompletResponseeDTO[]> {
    const response = await this.googleService.autocomplete(keyword, sessionToken, primaryTypes);

    if (!response.suggestions || response.suggestions.length === 0) {
      return [];
    }

    const result: autoCompletResponseeDTO[] = response.suggestions
      .filter((suggestion) => suggestion.placePrediction?.placeId && suggestion.placePrediction?.structuredFormat)
      .map((suggestion) => ({
        placeId: suggestion.placePrediction?.placeId || "",
        types: suggestion.placePrediction?.types || [],
        text: suggestion.placePrediction?.structuredFormat?.mainText?.text || "",
        address: suggestion.placePrediction?.structuredFormat?.secondaryText?.text || "",
      }));

    return result;
  }

  async getLocationById(placeID: string, sessionToken?: string) {
    const result = await this.googleService.getLocationById(placeID, sessionToken);

    return result;
  }
}
