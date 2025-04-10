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

  @OneToMany(() => TravelInterest, (travelInterest) => travelInterest.travelInterestType, { eager: false })
  travelInterests?: Relation<TravelInterest[]>;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
