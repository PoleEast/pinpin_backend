import { TravelStyle } from "@/entities/travel_style.entity.js";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class TravelStylesRepository {
  constructor(
    private readonly travelStylesRepository: Repository<TravelStyle>,
  ) {}

  //#region 查詢

  async FindAll(): Promise<TravelStyle[]> {
    return await this.travelStylesRepository.find();
  }

  //#endregion
}
