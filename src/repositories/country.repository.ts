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

  //#endregion
}
