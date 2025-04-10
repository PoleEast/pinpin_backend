import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Country } from "./country.entity.js";
import { UserProfile } from "./user_profile.entity.js";
import { IconType } from "./icon_type.entity.js";

@Entity("currency")
export class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  code!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

  @ManyToOne(() => IconType, { eager: false, nullable: false })
  iconType!: IconType;

  @ManyToMany(() => Country, (country) => country.currency, { eager: false })
  countries?: Relation<Country[]>;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.currencies, {
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
