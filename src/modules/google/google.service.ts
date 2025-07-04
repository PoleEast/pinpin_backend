import { GOOGLE_API_URL, INJECTION_TOKEN } from "../../common/constants/constants.js";
import { ConfigOptions } from "@/interfaces/google.interface.js";
import { PlacesClient } from "@googlemaps/places";
import type { protos } from "@googlemaps/places";
import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { StatusObject } from "@grpc/grpc-js";
@Injectable()
export class GoogleService {
  private readonly placesClient: PlacesClient;
  constructor(
    @Inject(INJECTION_TOKEN.GOOGLE_CONFIG)
    private readonly config: ConfigOptions,
  ) {
    if (!this.config.apiKey) {
      throw new Error("Google config is missing");
    }

    this.placesClient = new PlacesClient({ apiKey: this.config.apiKey });
    this.placesClient.initialize();
  }

  async getTextSearch(keyword: string, primaryType?: string, priceLevel?: string, nextPageToken?: string, pageSize?: number) {
    try {
      // #region 分頁功能有問題，先使用API一般的呼叫
      // const response = await this.placesClient.searchText(
      //   {
      //     textQuery: keyword,
      //     languageCode: "zh-TW",
      //     maxResultCount: 1,
      //     includedType: "restaurant",
      //   },
      //   {
      //     otherArgs: {
      //       //TODO:寫一個根據IPlace的interface屬性來拼接字串
      //       headers: {
      //         "X-Goog-FieldMask":
      //           // "places.displayName,places.primaryType,places.internationalPhoneNumber,places.shortFormattedAddress,places.rating,places.businessStatus,places.priceLevel,places.userRatingCount,nextPageToken",
      //           "nextPageToken",
      //       },
      //     },
      //   },
      // );
      // #endregion
      const request: protos.google.maps.places.v1.ISearchTextRequest = {
        textQuery: keyword,
        languageCode: "zh-TW",
        pageSize: pageSize ?? 12,
        pageToken: nextPageToken,
      };

      //TODO 篩選功能
      const response = await fetch(GOOGLE_API_URL.TEXT_SEARCH, {
        method: "POST",
        body: JSON.stringify(request),
        headers: new Headers({
          "X-Goog-Api-Key": this.config.apiKey ?? "",
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.displayName,places.primaryType,places.internationalPhoneNumber,places.shortFormattedAddress,places.rating,places.businessStatus,places.priceLevel,places.userRatingCount,nextPageToken",
        }),
      });

      const data: protos.google.maps.places.v1.ISearchTextResponse = await response.json();

      return data;
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: (error as StatusObject).details,
      });

      throw errorResponse;
    }
  }

  /**
   * 使用提供的關鍵字和會話令牌從 Google Places API 獲取自動完成建議。
   *
   * @param keyword - 用於自動完成搜索的關鍵字。
   * @param sessionToken - 用於跟踪用戶會話的會話令牌。
   * @param primaryTypes - 限制自動完成結果的主要類型列表。
   * @returns 包含自動完成建議的回應。
   * @throws 如果第三方服務發生錯誤，則拋出 HttpException。
   */

  async autocomplete(keyword: string, sessionToken: string, primaryTypes?: string[]) {
    try {
      const response = await this.placesClient.autocompletePlaces({
        input: keyword,
        languageCode: "zh-TW",
        sessionToken: sessionToken,
        includedPrimaryTypes: primaryTypes,
      });

      return response;
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: (error as StatusObject).details,
      });

      throw errorResponse;
    }
  }

  async getLocationById(placeID: string, sessionToken: string) {
    try {
      const response = await this.placesClient.getPlace(
        {
          name: `places/${placeID}`,
          languageCode: "zh-TW",
          sessionToken: sessionToken,
        },
        {
          otherArgs: {
            headers: {
              "X-Goog-FieldMask": "*",
            },
          },
        },
      );

      return response;
    } catch (error) {
      const errorResponse = new HttpException("第三方服務發生錯誤", HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: (error as StatusObject).details,
      });

      throw errorResponse;
    }
  }
}
