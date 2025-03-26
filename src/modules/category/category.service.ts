import { CurrencyRepositoryManager } from "../../repositories/currency.repository.js";
import { CountryDTO, CurrencyDTO, LanguageDTO, travelInterestDTO, TravelInterestTypeDTO, TravelStyleDTO } from "../../dtos/category.dto.js";
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
import { SettingResponseDTO } from "pinpin_library";

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
   * @returns {Promise<CountryDTO[]>} 包含所有國家資訊的陣列
   */
  async getCountry(): Promise<CountryDTO[]> {
    const countries: Country[] = await this.countryRepositoryManager.FindAllWithIconType();

    const countryDTOs: CountryDTO[] = countries.map((country) => ({
      id: country.id,
      code: country.code,
      dial_code: country.dial_code,
      english_name: country.english_name,
      local_name: country.local_name,
      icon: country.icon,
      icon_type: country.icon_type.name,
    }));

    return countryDTOs;
  }

  /**
   * 獲取所有幣別資料
   *
   * @returns {Promise<CurrencyDTO[]>} 包含所有幣別資訊的陣列
   */
  async getCurrency(): Promise<CurrencyDTO[]> {
    const countries: Currency[] = await this.currencyRepositoryManager.FindAllWithIconType();

    const currencyDTOs: CurrencyDTO[] = countries.map((currency) => ({
      id: currency.id,
      code: currency.code,
      icon: currency.icon,
      icon_type: currency.icon_type.name,
    }));

    return currencyDTOs;
  }

  /**
   * 獲取所有語言資料
   *
   * @returns {Promise<LanguageDTO[]>} 包含所有語言資訊的陣列
   */
  async getLanguage(): Promise<LanguageDTO[]> {
    const languages: Language[] = await this.languageRepositoryManager.FindAll();

    const languageDTOs: LanguageDTO[] = languages.map((language) => ({
      id: language.id,
      english_name: language.english_name,
      local_name: language.local_name,
    }));

    return languageDTOs;
  }

  /**
   * 獲取所有旅遊興趣類別資料
   *
   * @returns {Promise<TravelInterestTypeDTO[]>} 包含所有旅遊興趣類別資訊的陣列
   */
  async getTravelInterestType(): Promise<TravelInterestTypeDTO[]> {
    const result: TravelInterestType[] = await this.travelInterestTypeRepositoryManager.FindAllWithTravelInterest();

    const travelInterestTypeDTOs: TravelInterestTypeDTO[] = result.map((travelInterestType) => ({
      id: travelInterestType.id,
      name: travelInterestType.name,
      color: travelInterestType.color,
      travel_interests: travelInterestType.travel_interests?.map((travelInterest) => travelInterest.id) ?? [],
    }));

    return travelInterestTypeDTOs;
  }

  /**
   * 獲取所有旅遊興趣資料
   *
   * @returns {Promise<travelInterestDTO[]>} 包含所有旅遊興趣資訊的陣列
   */
  async getTravelInterest(): Promise<travelInterestDTO[]> {
    const result: TravelInterest[] = await this.travelInterestRepositoryManager.FindAllWithIconType();

    const travelInterestDTOs: travelInterestDTO[] = result.map((travelInterest) => ({
      id: travelInterest.id,
      name: travelInterest.name,
      icon: travelInterest.icon,
      icon_type: travelInterest.icon_type.name,
    }));

    return travelInterestDTOs;
  }

  /**
   * 獲取所有旅遊風格資料
   *
   * @returns {Promise<TravelStyleDTO[]>} 包含所有旅遊風格資訊的陣列
   */
  async getTravelStyles(): Promise<TravelStyleDTO[]> {
    const result: TravelStyle[] = await this.travelStylesRepositoryManager.FindAllWithIconType();

    const travelStylesDTOs: TravelStyleDTO[] = result.map((travelStyle) => ({
      id: travelStyle.id,
      name: travelStyle.name,
      description: travelStyle.description,
      icon: travelStyle.icon,
      color: travelStyle.color,
      icon_type: travelStyle.icon_type.name,
    }));

    return travelStylesDTOs;
  }

  /**
   * 獲取所有設定頁面資料
   *
   * @returns {Promise<SettingResponseDTO>} 包含所有設定資訊的物件
   */
  async getSettingData(): Promise<SettingResponseDTO> {
    const [country, currency, language, travelInterestType, travelInterest, travelStyle] = await Promise.all([
      this.getCountry(),
      this.getCurrency(),
      this.getLanguage(),
      this.getTravelInterestType(),
      this.getTravelInterest(),
      this.getTravelStyles(),
    ]);

    const settingResponse: SettingResponseDTO = {
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
