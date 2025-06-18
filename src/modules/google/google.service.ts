import { INJECTION_TOKEN } from "../../common/constants/constants.js";
import { ConfigOptions } from "@/interfaces/google.interface.js";
import { PlacesClient } from "@googlemaps/places";
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
  }

  async getTextSearch(keyword: string) {
    try {
      const response = await this.placesClient.searchText(
        {
          textQuery: keyword,
          languageCode: "zh-TW",
          maxResultCount: 5,
        },
        {
          otherArgs: {
            headers: {
              "X-Goog-FieldMask":
                "places.reviewSummary,places.displayName,places.generativeSummary,places.editorialSummary,places.primaryTypeDisplayName,places.pureServiceAreaBusiness,places.types,places.neighborhoodSummary",
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
    Logger.debug(typeof primaryTypes);
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
}
