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
import { CategoryType } from '../categories/entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova categoria personalizada' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma categoria com esse nome',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.create(createCategoryDto);
    return plainToInstance(CategoryResponseDto, category);
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorias do usuário + categorias padrão' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID do usuário para filtrar categorias',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CategoryType,
    description: 'Filtrar por tipo de categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Categorias retornadas com sucesso',
    type: [CategoryResponseDto],
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('type') type?: CategoryType,
  ): Promise<CategoryResponseDto[]> {
    const categories = userId
      ? await this.categoriesService.findAllForUser(userId, type)
      : await this.categoriesService.findAll(userId, type);

    return categories.map((category) =>
      plainToInstance(CategoryResponseDto, category),
    );
  }

  @Get('defaults')
  @ApiOperation({ summary: 'Listar apenas categorias padrão do sistema' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: CategoryType,
    description: 'Filtrar por tipo de categoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Categorias padrão retornadas com sucesso',
    type: [CategoryResponseDto],
  })
  async getDefaults(
    @Query('type') type?: CategoryType,
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll(undefined, type);
    return categories.map((category) =>
      plainToInstance(CategoryResponseDto, category),
    );
  }

  @Post('seed-defaults')
  @ApiOperation({ summary: 'Criar categorias padrão do sistema' })
  @ApiResponse({
    status: 201,
    description: 'Categorias padrão criadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Categorias padrão criadas com sucesso',
        },
        count: { type: 'number', example: 11 },
      },
    },
  })
  async seedDefaults(): Promise<{ message: string; count: number }> {
    const categories = await this.categoriesService.createDefaultCategories();
    return {
      message: 'Categorias padrão criadas com sucesso',
      count: categories.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  @ApiParam({ name: 'id', description: 'ID único da categoria' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID do usuário (para verificar permissões)',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId?: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findOne(id, userId);
    return plainToInstance(CategoryResponseDto, category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria personalizada' })
  @ApiParam({ name: 'id', description: 'ID único da categoria' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID do usuário (para verificar permissões)',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({
    status: 409,
    description: 'Não é possível editar categorias padrão ou nome já existe',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Query('userId') userId?: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.update(
      id,
      updateCategoryDto,
      userId,
    );
    return plainToInstance(CategoryResponseDto, category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover categoria personalizada (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID único da categoria' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'ID do usuário (para verificar permissões)',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Categoria removida com sucesso' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({
    status: 409,
    description: 'Não é possível remover categorias padrão',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId?: string,
  ): Promise<{ message: string }> {
    await this.categoriesService.remove(id, userId);
    return { message: 'Categoria removida com sucesso' };
  }
}
