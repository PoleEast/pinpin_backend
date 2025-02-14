import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user_profiles.entity.js';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
    account!: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password_hash!: string;

    @CreateDateColumn({ type: 'datetime', nullable: false, update: false })
    create_at!: Date;

    @Column({ type: 'datetime', nullable: true })
    last_login_at?: Date;

    @Column({ type: 'boolean', default: true })
    is_active!: boolean;

    @UpdateDateColumn({ type: 'datetime', nullable: true })
    update_at?: Date;

    @DeleteDateColumn()
    deleted_at?: Date;

    @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
        cascade: true,
    })
    profile!: Relation<UserProfile>;
}

