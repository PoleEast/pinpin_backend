import { TravelInterestType } from "@/entities/travel_Interest_type.entity.js";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class TravelInterestTypeRepository {
  constructor(
    private readonly travelInterestTypeRepository: Repository<TravelInterestType>,
  ) {}

  //#region 查詢

  /**
   * 取得所有旅遊興趣類別
   * @returns 包含所有旅遊興趣類別的陣列
   */
  async FindAll(): Promise<TravelInterestType[]> {
    return await this.travelInterestTypeRepository.find();
  }

  /**
   * 取得所有旅遊興趣類別，
   * 並且包括每個類別下面的所有旅遊興趣
   * @returns 包含所有旅遊興趣類別的陣列
   */
  async FindAllWithTravelInterest(): Promise<TravelInterestType[]> {
    return this.travelInterestTypeRepository.find({
      relations: {
        travel_interests: true,
      },
    });
  }

  //#endregion
}
