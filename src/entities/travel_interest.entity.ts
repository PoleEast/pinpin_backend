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
import { TravelInterestType } from "./travel_Interest_type.entity.js";
import { UserProfile } from "./user_profile.entity.js";
import { IconType } from "./icon_type.entity.js";

@Entity("travel_interest")
export class TravelInterest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

  @ManyToOne(() => IconType, { eager: false, nullable: false })
  iconType!: IconType;

  @ManyToOne(() => TravelInterestType, (travelInterestType) => travelInterestType.travelInterests, { eager: false })
  travelInterestType!: TravelInterestType;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.travelInterests, { eager: false })
  userProfiles!: Relation<UserProfile>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
