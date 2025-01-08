import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserModel } from '../../user/entities/user.entity';

@Entity('periods')
export class Period {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-json' })
  periodDays: Date[];

  @Column({ nullable: true, type: 'simple-json' })
  ovulationDays: Date[];

  @Column('int')
  periodMonth: number;

  @ManyToOne(() => UserModel, (user) => user.periods, { onDelete: 'CASCADE' })
  user: UserModel;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
