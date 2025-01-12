import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Period } from '../../period/entities/period.entity';
import { Article } from '../../article/entities/article.entity';

@Entity()
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column('int')
  age: number;

  @Column('int', { default: 28 }) // Default avg cycle length in days
  avgCycleLength: number;

  @Column('date', { nullable: true })
  startDateOfLastPeriod: Date;

  @Column('int', { default: 5, nullable: true }) // Default duration of the last period in days
  durationOfLastPeriod: number;

  @Column({ nullable: true, type: 'text' })
  profileImageUrl: string;

  @Column({ default: false })
  dailyMeditation: boolean;

  @Column({ default: false })
  workoutAlert: boolean;

  @Column({ default: false })
  hydrationReminder: boolean;

  @Column({ default: false })
  enableAccountSettings: boolean;

  @Column({ default: false })
  privateAccount: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  access?: string;

  expirationDate?: Date;

  @OneToMany(() => Period, (period) => period.user)
  periods: Period[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
