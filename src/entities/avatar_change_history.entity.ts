import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity.js";
import { Avatar } from "./avatar.entity.js";

@Entity("avatar_change_history")
export class AvatarChangeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, { eager: false, nullable: false })
  @JoinColumn({ name: "user_profile_id" })
  user_profile: Relation<UserProfile>;

  @ManyToOne(() => Avatar, { eager: false, nullable: false })
  @JoinColumn({ name: "avatar_id" })
  avatar: Relation<Avatar>;

  @UpdateDateColumn({ type: "datetime", nullable: false })
  change_date: Date;
}
