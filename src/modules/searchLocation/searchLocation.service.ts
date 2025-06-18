import { Injectable } from "@nestjs/common";
import { GoogleService } from "../google/google.service.js";
import { autoCompleteDTO } from "@/dtos/searchLocation.dto.js";

@Injectable()
export class SearchLocationService {
  constructor(private readonly googleService: GoogleService) {}

  async getTextSearchLocation(keyword: string) {
    return this.googleService.getTextSearch(keyword);
  }

  /**
   * 取得自動完成的結果
   * @param keyword 關鍵字
   * @param sessionToken  Google Places API 的 session token
   * @param primaryTypes  地點類型
   * @returns  自動完成的結果
   */
  async getAutoComplete(keyword: string, sessionToken: string, primaryTypes?: string[]): Promise<autoCompleteDTO[]> {
    const result = await this.googleService.autocomplete(keyword, sessionToken, primaryTypes);

    const suggestions = result[0].suggestions;
    const autoCompleteResult: autoCompleteDTO[] =
      suggestions?.map((suggestion) => ({
        placeId: suggestion.placePrediction?.placeId ?? "",
        types: suggestion.placePrediction?.types ?? [],
        text: suggestion.placePrediction?.text?.text ?? "",
      })) ?? [];

    return autoCompleteResult;
  }
}
