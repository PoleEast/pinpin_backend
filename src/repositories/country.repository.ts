import { Country } from "../entities/country.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CountryRepositoryManager {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  //#region 查詢

  /**
   * 獲取所有國家資料
   * @returns 包含所有國家的陣列
   */

  async FindAll(): Promise<Country[]> {
    return await this.countryRepository.find();
  }

  /**
   * 獲取所有國家資料，並且包括每個國家的icon_type
   * @returns 包含所有國家資訊的陣列
   */
  async FindAllWithIconType(): Promise<Country[]> {
    return await this.countryRepository.find({
      relations: {
        iconType: true,
      },
    });
  }

  //#endregion
}
