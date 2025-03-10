import { Country } from "../../entities/country.entity.js";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";
import { CountryRepositoryManager } from "../../repositories/country.repository.js";
import { CurrencyRepositoryManager } from "../../repositories/currency.repository.js";
import { LanguageRepositoryManager } from "../../repositories/language.repository.js";
import { TravelInterestTypeRepositoryManager } from "../../repositories/travel_Interest_type.repository.js";
import { TravelStylesRepositoryManager } from "../../repositories/travel_styles.repostiories.js";
import { Currency } from "../../entities/currency.entity.js";
import { Language } from "../../entities/language.entity.js";
import { TravelStyle } from "../../entities/travel_style.entity.js";
import { TravelInterestType } from "../../entities/travel_Interest_type.entity.js";
import { TravelInterestRepositoryManager } from "../../repositories/travel_Interest.repository.js";
import { TravelInterest } from "../../entities/travel_interest.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Country, Currency, Language, TravelInterestType, TravelInterest, TravelStyle])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CountryRepositoryManager,
    CurrencyRepositoryManager,
    LanguageRepositoryManager,
    TravelInterestTypeRepositoryManager,
    TravelInterestRepositoryManager,
    TravelStylesRepositoryManager,
  ],
})
export class CategoryModule {}
