import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user_profile.entity.js";
import { Avatar } from "./avatar.entity.js";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 32, nullable: false, unique: true })
  account!: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  passwordHash!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  email?: string;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @Column({ type: "datetime", nullable: true })
  lastLoginAt?: Date;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
  })
  profile!: Relation<UserProfile>;

  @OneToMany(() => Avatar, (avatar) => avatar.id, {
    eager: false,
  })
  avatars: Avatar[];
}
