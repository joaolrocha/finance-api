import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum GoalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export enum GoalType {
  SAVINGS = 'savings', // Meta de economia
  EXPENSE_LIMIT = 'expense_limit', // Limite de gastos
  DEBT_PAYMENT = 'debt_payment', // Pagamento de dívida
}

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: GoalType,
    default: GoalType.SAVINGS,
  })
  type: GoalType;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: GoalStatus,
    default: GoalStatus.ACTIVE,
  })
  status: GoalStatus;

  @Column({ nullable: true })
  color?: string; // Cor para visualização

  @Column({ nullable: true })
  icon?: string; // Ícone da meta

  @Column({ default: false })
  isAutomatic: boolean; // Meta automática baseada em regras

  @Column({ nullable: true, type: 'jsonb' })
  rules?: object; // Regras para metas automáticas

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relacionamentos
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Método computado para progresso
  get progress(): number {
    if (this.targetAmount === 0) return 0;
    return Math.min(
      (Number(this.currentAmount) / Number(this.targetAmount)) * 100,
      100,
    );
  }

  get isCompleted(): boolean {
    return this.progress >= 100;
  }

  get daysRemaining(): number {
    const now = new Date();
    const deadline = new Date(this.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
