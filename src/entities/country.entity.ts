import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Language } from "./language.entity.js";
import { Currency } from "./currency.entity.js";
import { UserProfile } from "./user_profile.entity.js";

@Entity("country")
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 3, nullable: false })
  code!: string;

  @Column({ type: "int", nullable: false })
  dial_code!: number;

  @Column({
    type: "varchar",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
    length: 50,
    nullable: false,
  })
  english_name!: string;

  @Column({
    type: "varchar",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
    length: 50,
    nullable: false,
  })
  local_name!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

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

  @OneToMany(() => UserProfile, (userProfile) => userProfile.origin_country, {
    eager: false,
  })
  user_profiles_originCountry?: Relation<UserProfile[]>;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.visited_countries, { eager: false })
  user_profiles_visited_countries?: Relation<UserProfile[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
