import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { TravelInterest } from "./travel_interest.entity.js";

@Entity("travel_interest_type")
export class TravelInterestType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  color!: string;

  @OneToMany(() => TravelInterest, (travelInterest) => travelInterest.travel_interest_type, { eager: false })
  travel_interests?: Relation<TravelInterest[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
