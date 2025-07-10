import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalStatus } from '../goals/entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    // Validar data limite
    const deadline = new Date(createGoalDto.deadline);
    const today = new Date();

    if (deadline <= today) {
      throw new BadRequestException('Data limite deve ser no futuro');
    }

    const goal = this.goalRepository.create(createGoalDto);
    const savedGoal = await this.goalRepository.save(goal);

    return this.addCalculatedFields(savedGoal);
  }

  async findAll(userId: string, status?: GoalStatus): Promise<Goal[]> {
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const goals = await this.goalRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return goals.map((goal) => this.addCalculatedFields(goal));
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException('Meta não encontrada');
    }

    return this.addCalculatedFields(goal);
  }

  async update(
    id: string,
    updateGoalDto: UpdateGoalDto,
    userId: string,
  ): Promise<Goal> {
    const goal = await this.findOne(id, userId);

    // Validar data limite se estiver sendo alterada
    if (updateGoalDto.deadline) {
      const deadline = new Date(updateGoalDto.deadline);
      const today = new Date();

      if (deadline <= today) {
        throw new BadRequestException('Data limite deve ser no futuro');
      }
    }

    Object.assign(goal, updateGoalDto);
    const updated = await this.goalRepository.save(goal);

    return this.addCalculatedFields(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);
    await this.goalRepository.remove(goal);
  }

  async updateProgress(
    id: string,
    updateProgressDto: UpdateGoalProgressDto,
    userId: string,
  ): Promise<Goal> {
    const goal = await this.findOne(id, userId);

    const { amount, operation = 1 } = updateProgressDto;
    const change = amount * operation;

    let newCurrentAmount = Number(goal.currentAmount) + change;

    // Não permitir valores negativos
    if (newCurrentAmount < 0) {
      newCurrentAmount = 0;
    }

    goal.currentAmount = newCurrentAmount;

    // Verificar se atingiu a meta
    if (
      newCurrentAmount >= Number(goal.targetAmount) &&
      goal.status === GoalStatus.ACTIVE
    ) {
      goal.status = GoalStatus.COMPLETED;
    }

    const updated = await this.goalRepository.save(goal);
    return this.addCalculatedFields(updated);
  }

  async getActiveGoals(userId: string): Promise<Goal[]> {
    return this.findAll(userId, GoalStatus.ACTIVE);
  }

  async getCompletedGoals(userId: string): Promise<Goal[]> {
    return this.findAll(userId, GoalStatus.COMPLETED);
  }

  async getOverdueGoals(userId: string): Promise<Goal[]> {
    const goals = await this.findAll(userId, GoalStatus.ACTIVE);
    const today = new Date();

    return goals.filter((goal) => new Date(goal.deadline) < today);
  }

  async getGoalStats(userId: string): Promise<{
    total: number;
    active: number;
    completed: number;
    overdue: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    averageProgress: number;
  }> {
    const goals = await this.findAll(userId);
    const activeGoals = goals.filter((g) => g.status === GoalStatus.ACTIVE);
    const completedGoals = goals.filter(
      (g) => g.status === GoalStatus.COMPLETED,
    );
    const overdueGoals = await this.getOverdueGoals(userId);

    const totalTargetAmount = goals.reduce(
      (sum, goal) => sum + Number(goal.targetAmount),
      0,
    );
    const totalCurrentAmount = goals.reduce(
      (sum, goal) => sum + Number(goal.currentAmount),
      0,
    );
    const averageProgress =
      goals.length > 0
        ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
        : 0;

    return {
      total: goals.length,
      active: activeGoals.length,
      completed: completedGoals.length,
      overdue: overdueGoals.length,
      totalTargetAmount,
      totalCurrentAmount,
      averageProgress,
    };
  }

  private addCalculatedFields(goal: Goal): Goal {
    const targetAmount = Number(goal.targetAmount);
    const currentAmount = Number(goal.currentAmount);
    const today = new Date();
    const deadline = new Date(goal.deadline);

    // Progresso em percentual
    const progress =
      targetAmount > 0
        ? Math.min((currentAmount / targetAmount) * 100, 100)
        : 0;

    // Se está completa
    const isCompleted = progress >= 100;

    // Dias restantes
    const diffTime = deadline.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Se está atrasada
    const isOverdue = daysRemaining < 0;

    // Valor diário necessário para atingir a meta
    const remainingAmount = Math.max(targetAmount - currentAmount, 0);
    const dailyTargetToReach =
      daysRemaining > 0 ? remainingAmount / daysRemaining : 0;

    // Criar objeto com campos calculados (sem modificar a entity)
    return {
      ...goal,
      progress: Math.round(progress * 100) / 100, // 2 casas decimais
      isCompleted: isCompleted,
      daysRemaining: daysRemaining,
      isOverdue: isOverdue,
      dailyTargetToReach: Math.round(dailyTargetToReach * 100) / 100,
    } as Goal & {
      progress: number;
      isCompleted: boolean;
      daysRemaining: number;
      isOverdue: boolean;
      dailyTargetToReach: number;
    };
  }
}
