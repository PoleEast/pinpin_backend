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
  englishName!: string;

  @Column({
    type: "varchar",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
    length: 50,
    nullable: false,
  })
  localName!: string;

  @ManyToMany(() => Country, (country) => country.language, { eager: false })
  countries?: Relation<Country[]>;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.languages, {
    eager: false,
  })
  userProfiles?: Relation<UserProfile[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
