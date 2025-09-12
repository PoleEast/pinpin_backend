import { CurrencyRepositoryManager } from "../../repositories/currency.repository.js";
import { CountryDto, CurrencyDto, LanguageDto, travelInterestDto, TravelInterestTypeDto, TravelStyleDto } from "../../dtos/category.dto.js";
import { CountryRepositoryManager } from "../../repositories/country.repository.js";
import { Injectable } from "@nestjs/common";
import { Currency } from "../../entities/currency.entity.js";
import { Country } from "../../entities/country.entity.js";
import { LanguageRepositoryManager } from "../../repositories/language.repository.js";
import { Language } from "../../entities/language.entity.js";
import { TravelInterestTypeRepositoryManager } from "../../repositories/travel_Interest_type.repository.js";
import { TravelInterestType } from "../../entities/travel_Interest_type.entity.js";
import { TravelInterest } from "../../entities/travel_interest.entity.js";
import { TravelInterestRepositoryManager } from "../../repositories/travel_Interest.repository.js";
import { TravelStylesRepositoryManager } from "../../repositories/travel_styles.repostiories.js";
import { TravelStyle } from "@/entities/travel_style.entity.js";
import { SettingResponse } from "pinpin_library";

@Injectable()
export class CategoryService {
  constructor(
    private readonly countryRepositoryManager: CountryRepositoryManager,
    private readonly currencyRepositoryManager: CurrencyRepositoryManager,
    private readonly languageRepositoryManager: LanguageRepositoryManager,
    private readonly travelInterestTypeRepositoryManager: TravelInterestTypeRepositoryManager,
    private readonly travelInterestRepositoryManager: TravelInterestRepositoryManager,
    private readonly travelStylesRepositoryManager: TravelStylesRepositoryManager,
  ) {}

  /**
   * 獲取所有國家資料
   *
   * @returns {Promise<CountryDto[]>} 包含所有國家資訊的陣列
   */
  async getCountry(): Promise<CountryDto[]> {
    const countries: Country[] = await this.countryRepositoryManager.FindAllWithIconType();

    const countryDtos: CountryDto[] = countries.map((country) => ({
      id: country.id,
      code: country.code,
      dial_code: country.dialCode,
      english_name: country.englishName,
      local_name: country.localName,
      icon: country.icon,
      icon_type: country.iconType.name,
    }));

    return countryDtos;
  }

  /**
   * 獲取所有幣別資料
   *
   * @returns {Promise<CurrencyDto[]>} 包含所有幣別資訊的陣列
   */
  async getCurrency(): Promise<CurrencyDto[]> {
    const countries: Currency[] = await this.currencyRepositoryManager.FindAllWithIconType();

    const currencyDtos: CurrencyDto[] = countries.map((currency) => ({
      id: currency.id,
      code: currency.code,
      icon: currency.icon,
      icon_type: currency.iconType.name,
    }));

    return currencyDtos;
  }

  /**
   * 獲取所有語言資料
   *
   * @returns {Promise<LanguageDto[]>} 包含所有語言資訊的陣列
   */
  async getLanguage(): Promise<LanguageDto[]> {
    const languages: Language[] = await this.languageRepositoryManager.FindAll();

    const languageDtos: LanguageDto[] = languages.map((language) => ({
      id: language.id,
      english_name: language.englishName,
      local_name: language.localName,
    }));

    return languageDtos;
  }

  /**
   * 獲取所有旅遊興趣類別資料
   *
   * @returns {Promise<TravelInterestTypeDto[]>} 包含所有旅遊興趣類別資訊的陣列
   */
  async getTravelInterestType(): Promise<TravelInterestTypeDto[]> {
    const result: TravelInterestType[] = await this.travelInterestTypeRepositoryManager.FindAllWithTravelInterest();

    const travelInterestTypeDtos: TravelInterestTypeDto[] = result.map((travelInterestType) => ({
      id: travelInterestType.id,
      name: travelInterestType.name,
      color: travelInterestType.color,
      travel_interests: travelInterestType.travelInterests?.map((travelInterest) => travelInterest.id) ?? [],
    }));

    return travelInterestTypeDtos;
  }

  /**
   * 獲取所有旅遊興趣資料
   *
   * @returns {Promise<travelInterestDto[]>} 包含所有旅遊興趣資訊的陣列
   */
  async getTravelInterest(): Promise<travelInterestDto[]> {
    const result: TravelInterest[] = await this.travelInterestRepositoryManager.FindAllWithIconType();

    const travelInterestDtos: travelInterestDto[] = result.map((travelInterest) => ({
      id: travelInterest.id,
      name: travelInterest.name,
      icon: travelInterest.icon,
      icon_type: travelInterest.iconType.name,
    }));

    return travelInterestDtos;
  }

  /**
   * 獲取所有旅遊風格資料
   *
   * @returns {Promise<TravelStyleDto[]>} 包含所有旅遊風格資訊的陣列
   */
  async getTravelStyles(): Promise<TravelStyleDto[]> {
    const result: TravelStyle[] = await this.travelStylesRepositoryManager.FindAllWithIconType();

    const travelStylesDtos: TravelStyleDto[] = result.map((travelStyle) => ({
      id: travelStyle.id,
      name: travelStyle.name,
      description: travelStyle.description,
      icon: travelStyle.icon,
      color: travelStyle.color,
      icon_type: travelStyle.iconType.name,
    }));

    return travelStylesDtos;
  }

  /**
   * 獲取所有設定頁面資料
   *
   * @returns {Promise<SettingResponse>} 包含所有設定資訊的物件
   */
  async getSettingData(): Promise<SettingResponse> {
    const [country, currency, language, travelInterestType, travelInterest, travelStyle] = await Promise.all([
      this.getCountry(),
      this.getCurrency(),
      this.getLanguage(),
      this.getTravelInterestType(),
      this.getTravelInterest(),
      this.getTravelStyles(),
    ]);

    const settingResponse: SettingResponse = {
      country: country,
      currency: currency,
      language: language,
      travelInterestType: travelInterestType,
      travelInterest: travelInterest,
      travelStyle: travelStyle,
    };

    return settingResponse;
  }
}
