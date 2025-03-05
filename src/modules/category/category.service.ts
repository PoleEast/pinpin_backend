import { CountryDTO } from "../../dtos/category.dto.js";
import { CountryRepositoryManager } from "../../repositories/country.repository.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryService {
  constructor(private readonly countryRepository: CountryRepositoryManager) {}

  /**
   * 獲取所有國家資料
   *
   * @returns {Promise<CountryDTO[]>} 包含所有國家資訊的陣列
   */
  async getCountry(): Promise<CountryDTO[]> {
    const countries: CountryDTO[] = await this.countryRepository.FindAll();

    return countries;
  }
}
