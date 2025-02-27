import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { Country } from "./country.entity.js";
import { UserProfile } from "./user_profile.entity.js";

@Entity("currency")
export class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  code!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  icon!: string;

  @ManyToMany(() => Country, (country) => country.currency, { eager: false })
  countries?: Relation<Country[]>;

  @ManyToMany(() => UserProfile, (userProfile) => userProfile.currencies, {
    eager: false,
  })
  user_profiles?: Relation<UserProfile[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
