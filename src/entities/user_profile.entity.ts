import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity.js";
import { Country } from "./country.entity.js";
import { Language } from "./language.entity.js";
import { Currency } from "./currency.entity.js";
import { TravelInterest } from "./travel_interest.entity.js";
import { TravelStyle } from "./travel_style.entity.js";
import { Avatar } from "./avatar.entity.js";
import { AvatarChangeHistory } from "./avatar_change_history.entity.js";

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  motto?: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  bio?: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  fullname?: string;

  @Column({ type: "varchar", length: 16, nullable: false })
  nickname!: string;

  @Column({ type: "boolean", default: false, nullable: false })
  isFullNameVisible!: boolean;

  @Column({ type: "varchar", length: 100, nullable: true })
  coverPhoto?: string;

  @Column({ type: "datetime", nullable: true })
  birthday?: Date;

  @Column({
    type: "int",
    comment: "0:男 1:女 2:不公開",
    nullable: true,
  })
  gender?: number;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  address?: string;

  @ManyToOne(() => Avatar, (avatar) => avatar.userProfile, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: "avatar_id", referencedColumnName: "id" })
  avatar!: Relation<Avatar>;

  @ManyToOne(() => Country, (country) => country.userProfilesOriginCountry, {
    eager: false,
  })
  originCountry?: Relation<Country>;

  @ManyToMany(() => Country, (country) => country.userProfilesVisitedCountries, { eager: false })
  @JoinTable()
  visitedCountries?: Relation<Country[]>;

  @ManyToMany(() => Language, (language) => language.userProfiles, {
    eager: false,
  })
  @JoinTable()
  languages?: Relation<Language[]>;

  @ManyToMany(() => Currency, (currency) => currency.userProfiles, {
    eager: false,
  })
  @JoinTable()
  currencies?: Relation<Currency[]>;

  @ManyToMany(() => TravelInterest, (travelInterest) => travelInterest.userProfiles, { eager: false })
  @JoinTable()
  travelInterests?: Relation<TravelInterest[]>;

  @ManyToMany(() => TravelStyle, (travelStyle) => travelStyle.userProfiles, {
    eager: false,
  })
  @JoinTable()
  travelStyles?: Relation<TravelStyle[]>;

  @OneToOne(() => User, (user) => user.profile, {
    eager: false,
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: Relation<User>;

  @OneToMany(() => AvatarChangeHistory, (avatar_change_history) => avatar_change_history.user_profile, { eager: false, cascade: true })
  avatar_changed_history: Relation<AvatarChangeHistory[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
