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
import { UserProfile } from "./user_profile.entity.js";
import { IconType } from "./icon_type.entity.js";

@Entity("travel_style")
export class TravelStyle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  description!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

  @ManyToOne(() => IconType, { eager: false, nullable: false })
  iconType!: IconType;

  @Column({ type: "varchar", length: 50, nullable: false })
  color!: string;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.travelStyles, {
    eager: false,
  })
  userProfiles?: Relation<UserProfile>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
