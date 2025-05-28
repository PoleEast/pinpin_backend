import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UserProfile } from "./user_profile.entity.js";
import { User } from "./user.entity.js";

@Entity("avatar")
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  public_id: string;

  @Column({ type: "int", comment: "0:userUpload 1:default", nullable: false })
  type: number;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.avatar, {
    eager: false,
    nullable: true,
  })
  userProfile?: Relation<UserProfile>;

  @ManyToOne(() => User, (user) => user.avatars, {
    eager: false,
    nullable: true,
  })
  user?: Relation<User>;
}
