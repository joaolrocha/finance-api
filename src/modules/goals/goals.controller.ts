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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { GoalStatus } from './entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalResponseDto } from './dto/goal-response.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@ApiTags('Goals')
@ApiBearerAuth('JWT-auth')
@Controller('goals')
@UseInterceptors(ClassSerializerInterceptor)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova meta financeira' })
  @ApiResponse({
    status: 201,
    description: 'Meta criada com sucesso',
    type: GoalResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou data limite no passado',
  })
  async create(@Body() createGoalDto: CreateGoalDto): Promise<GoalResponseDto> {
    const goal = await this.goalsService.create(createGoalDto);
    return plainToInstance(GoalResponseDto, goal);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar metas do usuário com filtro opcional por status',
  })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: GoalStatus,
    description: 'Filtrar por status da meta',
  })
  @ApiResponse({
    status: 200,
    description: 'Metas retornadas com sucesso',
    type: [GoalResponseDto],
  })
  async findAll(
    @Query('userId') userId: string,
    @Query('status') status?: GoalStatus,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.findAll(userId, status);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar apenas metas ativas do usuário' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Metas ativas retornadas com sucesso',
    type: [GoalResponseDto],
  })
  async getActiveGoals(
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.getActiveGoals(userId);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('completed')
  @ApiOperation({ summary: 'Listar apenas metas completadas do usuário' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Metas completadas retornadas com sucesso',
    type: [GoalResponseDto],
  })
  async getCompletedGoals(
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.getCompletedGoals(userId);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Listar metas vencidas (prazo expirado)' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Metas vencidas retornadas com sucesso',
    type: [GoalResponseDto],
  })
  async getOverdueGoals(
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto[]> {
    const goals = await this.goalsService.getOverdueGoals(userId);
    return goals.map((goal) => plainToInstance(GoalResponseDto, goal));
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Obter estatísticas consolidadas das metas do usuário',
  })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas das metas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 5, description: 'Total de metas' },
        active: { type: 'number', example: 3, description: 'Metas ativas' },
        completed: {
          type: 'number',
          example: 1,
          description: 'Metas completadas',
        },
        overdue: { type: 'number', example: 1, description: 'Metas vencidas' },
        totalTargetAmount: {
          type: 'number',
          example: 50000,
          description: 'Soma de todos os valores alvo',
        },
        totalCurrentAmount: {
          type: 'number',
          example: 15000,
          description: 'Soma de todos os valores atuais',
        },
        averageProgress: {
          type: 'number',
          example: 30.5,
          description: 'Progresso médio em percentual',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Buscar meta específica por ID' })
  @ApiParam({ name: 'id', description: 'ID único da meta' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Meta encontrada com sucesso',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalsService.findOne(id, userId);
    return plainToInstance(GoalResponseDto, goal);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da meta' })
  @ApiParam({ name: 'id', description: 'ID único da meta' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Meta atualizada com sucesso',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou data limite no passado',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Query('userId') userId: string,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalsService.update(id, updateGoalDto, userId);
    return plainToInstance(GoalResponseDto, goal);
  }

  @Patch(':id/progress')
  @ApiOperation({
    summary: 'Atualizar progresso da meta (adicionar/subtrair valor)',
  })
  @ApiParam({ name: 'id', description: 'ID único da meta' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description:
      'Progresso atualizado com sucesso. Meta pode ser marcada como completada automaticamente.',
    type: GoalResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  @ApiResponse({ status: 400, description: 'Valor inválido' })
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
  @ApiOperation({ summary: 'Remover meta permanentemente' })
  @ApiParam({ name: 'id', description: 'ID único da meta' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: true })
  @ApiResponse({
    status: 200,
    description: 'Meta removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Meta removida com sucesso' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Meta não encontrada' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.goalsService.remove(id, userId);
    return { message: 'Meta removida com sucesso' };
  }
}
