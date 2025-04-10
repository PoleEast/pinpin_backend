import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("icon_type")
export class IconType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  createAt!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  updateAt?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deletedAt?: Date;
}
