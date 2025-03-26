import { TravelStyle } from "../entities/travel_style.entity.js";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TravelStylesRepositoryManager {
  constructor(
    @InjectRepository(TravelStyle)
    private readonly travelStylesRepository: Repository<TravelStyle>,
  ) {}

  //#region 查詢

  /**
   * 取得所有旅遊風格
   * @returns 包含所有旅遊風格的陣列
   */
  async FindAll(): Promise<TravelStyle[]> {
    return await this.travelStylesRepository.find();
  }

  async FindAllWithIconType(): Promise<TravelStyle[]> {
    return await this.travelStylesRepository.find({
      relations: {
        icon_type: true,
      },
    });
  }

  //#endregion
}
