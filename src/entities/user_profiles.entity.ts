import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'nvarchar', length: 16 })
    nickname!: string;

    @Column({ type: 'datetime', nullable: true })
    birthday?: Date;

    @Column({
        type: 'int',
        default: 2,
        comment: '0:男 1:女 2:不公開',
        nullable: true,
    })
    gender?: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    email?: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone?: string;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    address?: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}
