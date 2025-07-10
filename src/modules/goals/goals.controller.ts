import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GoalStatus } from '../goals/entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@Controller('goals')
@UseInterceptors(ClassSerializerInterceptor)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  async create(@Body() createGoalDto: CreateGoalDto): Promise<GoalResponseDto> {
    const goal = await this.goalsService.create(createGoalDto);
    return plainToInstance(GoalResponseDto, goal);
  }

  @Get()
  async findAll(
    @Query('userId') userId: string,
    @Query('status') status?: GoalStatus,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.findAll(userId, status);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('active')
  async getActiveGoals(
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.getActiveGoals(userId);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('completed')
  async getCompletedGoals(
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.getCompletedGoals(userId);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('overdue')
  async getOverdueGoals(
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.getOverdueGoals(userId);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('stats')
  async getStats(@Query('userId') userId: string): Promise<{
    total: number;
    active: number;
    completed: number;
    overdue: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    averageProgress: number;
  }> {
    return await this.goalsService.getGoalStats(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalsService.findOne(id, userId);
    return plainToInstance(GoalResponseDto, goal);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalsService.update(id, updateGoalDto, userId);
    return plainToInstance(GoalResponseDto, goal);
  }

  @Patch(':id/progress')
  async updateProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProgressDto: UpdateGoalProgressDto,
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalsService.updateProgress(
      id,
      updateProgressDto,
      userId,
    );
    return plainToInstance(GoalResponseDto, goal);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.goalsService.remove(id, userId);
    return { message: 'Meta removida com sucesso' };
  }
}
