import { ConstObjectValues } from "@/common/utils/type.util.js";
import { INJECTION_TOKEN, ORIGINAL_GOOGLE_MAPS_PLACE } from "../../common/constants/constants.js";
import { ConfigOptions } from "@/interfaces/google.interface.js";
import { places, places_v1 } from "@googleapis/places";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";

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
          "places.id,places.displayName,places.primaryType,places.iconMaskBaseUri,places.internationalPhoneNumber,places.shortFormattedAddress,places.rating,places.businessStatus,places.photos,places.priceLevel,places.userRatingCount,nextPageToken",
      });

      return response.data;
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤" + keyword, HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });

      throw errorResponse;
    }
  }

  // async getTestSearchLocation(
  //   keyword: string,
  //   primaryType: string = "",
  //   priceLevel?: ConstObjectValues<typeof ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL>[],
  //   nextPageToken: string = "",
  //   pageSize: number = 12,
  // ): Promise<places_v1.Schema$GoogleMapsPlacesV1SearchTextResponse> {
  //   return JSON.parse(readFileSync("./src/assets/locationData.json", "utf-8")) as places_v1.Schema$GoogleMapsPlacesV1SearchTextResponse;
  // }

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

  async getLocationById(placeID: string, sessionToken?: string) {
    try {
      const response = await this.places.places.get({
        name: `places/${placeID}`,
        sessionToken: sessionToken,
        fields: "*",
        languageCode: "zh-TW",
      });
      return response.data;
    } catch (error) {
      Logger.error(JSON.stringify(error));
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
      throw errorResponse;
    }
  }

  async getPhoto(placeId: string, maxWidth?: number, maxHeight: number = 200): Promise<string> {
    try {
      const response = await this.places.places.photos.getMedia({
        name: placeId,
        maxWidthPx: maxWidth,
        maxHeightPx: maxHeight,
        skipHttpRedirect: true,
      });

      return response.data.photoUri || "";
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });

      throw errorResponse;
    }
  }
}
