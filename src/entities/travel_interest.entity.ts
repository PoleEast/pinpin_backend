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
  icon_type!: IconType;

  @ManyToOne(() => TravelInterestType, (travelInterestType) => travelInterestType.travel_interests, { eager: false })
  travel_interest_type!: TravelInterestType;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.travel_interests, { eager: false })
  user_profiles!: Relation<UserProfile>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
