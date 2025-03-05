import { Language } from "@/entities/language.entity.js";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

@Injectable()
export class LanguageRepositoryManager {
  constructor(private readonly languageRepository: Repository<Language>) {}

  //#region 查詢

  /**
   * 取得所有語言
   * @returns 包含所有語言的陣列
   */
  async FindAll(): Promise<Language[]> {
    return this.languageRepository.find();
  }

  //#endregion
}
