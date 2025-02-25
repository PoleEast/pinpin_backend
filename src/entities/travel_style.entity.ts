import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { UserProfile } from "./user_profile.entity.js";

@Entity("travel_style")
export class TravelStyle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  description?: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  color!: string;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.travel_styles, {
    eager: false,
  })
  user_profiles?: Relation<UserProfile>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
