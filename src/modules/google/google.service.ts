import { ConstObjectValues } from "@/common/utils/type.util.js";
import { INJECTION_TOKEN, ORIGINAL_GOOGLE_MAPS_PLACE } from "../../common/constants/constants.js";
import { ConfigOptions } from "@/interfaces/google.interface.js";
import { places, places_v1 } from "@googleapis/places";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GoogleMapsPlacePriceLevel } from "pinpin_library";
@Injectable()
export class GoogleService {
  private places: places_v1.Places;
  constructor(
    @Inject(INJECTION_TOKEN.GOOGLE_CONFIG)
    private readonly config: ConfigOptions,
  ) {
    if (!this.config.apiKey) {
      throw new Error("Google config is missing");
    }

    this.places = places({
      version: "v1",
      auth: this.config.apiKey,
    });
  }

  async getTextSearch(
    keyword: string,
    primaryType?: string,
    priceLevel?: ConstObjectValues<typeof ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL>[],
    nextPageToken?: string,
    pageSize?: number,
  ): Promise<places_v1.Schema$GoogleMapsPlacesV1SearchTextResponse> {
    try {
      const response = await this.places.places.searchText({
        requestBody: {
          textQuery: keyword,
          languageCode: "zh-TW",
          pageToken: nextPageToken,
          pageSize: pageSize,
          priceLevels: priceLevel,
          includedType: primaryType,
        },
        fields:
          "places.id,places.displayName,places.primaryType,places.internationalPhoneNumber,places.shortFormattedAddress,places.rating,places.businessStatus,places.photos,places.priceLevel,places.userRatingCount,nextPageToken",
      });

      return response.data;
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });

      throw errorResponse;
    }
  }

  async autocomplete(keyword: string, sessionToken: string, primaryTypes?: string[]) {
    try {
      const response = await this.places.places.autocomplete({
        requestBody: {
          input: keyword,
          sessionToken: sessionToken,
          languageCode: "zh-TW",
          includedPrimaryTypes: primaryTypes,
        },
        fields: "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types",
      });

      return response.data;
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });

      throw errorResponse;
    }
  }

  async getLocationById(placeID: string, sessionToken: string) {}
}
