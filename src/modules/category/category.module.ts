import { Country } from "../../entities/country.entity.js";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "./category.controller.js";
import { CategoryService } from "./category.service.js";
import { CountryRepositoryManager } from "../../repositories/country.repository.js";

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CategoryController],
  providers: [CategoryService, CountryRepositoryManager],
})
export class CategoryModule {}
