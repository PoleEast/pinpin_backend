import { TravelInterest } from "../entities/travel_interest.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TravelInterestRepositoryManager {
  constructor(
    @InjectRepository(TravelInterest)
    private readonly travelInterestRepository: Repository<TravelInterest>,
  ) {}

  //#region 查詢

  /**
   * 取得所有旅遊興趣
   * @returns {Promise<TravelInterest[]>} 包含所有旅遊興趣的陣列
   */
  async FindAll(): Promise<TravelInterest[]> {
    return await this.travelInterestRepository.find();
  }

  /**
   * 取得所有旅遊興趣，
   * 並且包括每個旅遊興趣的圖示類型
   * @returns {Promise<TravelInterest[]>} 包含所有旅遊興趣的陣列
   */
  async FindAllWithIconType(): Promise<TravelInterest[]> {
    return await this.travelInterestRepository.find({
      relations: {
        icon_type: true,
      },
    });
  }

  //#endregion
}
