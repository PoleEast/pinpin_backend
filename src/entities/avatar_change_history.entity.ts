import { Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity.js";
import { Avatar } from "./avatar.entity.js";

@Entity("avatar_change_history")
export class AvatarChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, { eager: false, nullable: false })
  user_profile_id: number;

  @ManyToOne(() => Avatar, { eager: false, nullable: false })
  avatar_id: number;

  @UpdateDateColumn({ type: "datetime", nullable: false })
  change_date: Date;
}
