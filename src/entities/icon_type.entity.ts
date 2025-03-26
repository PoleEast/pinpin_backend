import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("icon_type")
export class IconType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  name!: string;

  @CreateDateColumn({ type: "datetime", nullable: false, update: false })
  create_at!: Date;

  @UpdateDateColumn({ type: "datetime", nullable: true })
  update_at?: Date;

  @DeleteDateColumn({ type: "datetime", nullable: true })
  deleted_at?: Date;
}
