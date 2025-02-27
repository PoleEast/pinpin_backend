import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Country } from "./country.entity.js";
import { UserProfile } from "./user_profile.entity.js";

@Entity("language")
export class Language {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @ManyToMany(() => Country, (country) => country.language, { eager: false })
  countries?: Relation<Country[]>;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.languages, {
    eager: false,
  })
  user_profiles?: Relation<UserProfile[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
