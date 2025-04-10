import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Language } from "./language.entity.js";
import { Currency } from "./currency.entity.js";
import { UserProfile } from "./user_profile.entity.js";
import { IconType } from "./icon_type.entity.js";

@Entity("country")
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 3, nullable: false })
  code!: string;

  @Column({ type: "int", nullable: false })
  dialCode!: number;

  @Column({
    type: "varchar",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
    length: 50,
    nullable: false,
  })
  englishName!: string;

  @Column({
    type: "varchar",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
    length: 50,
    nullable: false,
  })
  localName!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

  @ManyToOne(() => IconType, { eager: false, nullable: false })
  iconType!: IconType;

  @ManyToMany(() => Language, (language) => language.countries, {
    eager: false,
  })
  @JoinTable()
  language?: Relation<Language[]>;

  @ManyToMany(() => Currency, (currency) => currency.countries, {
    eager: false,
  })
  @JoinTable()
  currency?: Relation<Currency[]>;

  @OneToMany(() => UserProfile, (userProfile) => userProfile.originCountry, {
    eager: false,
  })
  userProfilesOriginCountry?: Relation<UserProfile[]>;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.visitedCountries, { eager: false })
  userProfilesVisitedCountries?: Relation<UserProfile[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
