import { Currency } from "../entities/currency.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CurrencyRepositoryManager {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  //#region 查詢

  /**
   * 取得所有幣別
   * @returns 包含所有幣別的陣列
   */
  async FindAll(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  /**
   * 取得所有幣別，並且包括每個幣別的 icon_type
   * @returns 包含所有幣別的陣列
   */
  async FindAllWithIconType(): Promise<Currency[]> {
    return await this.currencyRepository.find({
      relations: {
        iconType: true,
      },
    });
  }

  //#endregion
}
