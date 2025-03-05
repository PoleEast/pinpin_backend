import { Currency } from "@/entities/currency.entity.js";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class CurrencyRepositoryManager {
  constructor(private readonly currencyRepository: Repository<Currency>) {}

  //#region 查詢

  /**
   * 取得所有幣別
   * @returns 包含所有幣別的陣列
   */
  async FindAll(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  //#endregion
}
