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
import { CategoryType } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.create(createCategoryDto);
    return plainToInstance(CategoryResponseDto, category);
  }

  @Get()
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
  async getDefaults(
    @Query('type') type?: CategoryType,
  ): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll(undefined, type);
    return categories.map((category) =>
      plainToInstance(CategoryResponseDto, category),
    );
  }

  @Post('seed-defaults')
  async seedDefaults(): Promise<{ message: string; count: number }> {
    const categories = await this.categoriesService.createDefaultCategories();
    return {
      message: 'Categorias padrão criadas com sucesso',
      count: categories.length,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId?: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findOne(id, userId);
    return plainToInstance(CategoryResponseDto, category);
  }

  @Patch(':id')
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
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('userId') userId?: string,
  ): Promise<{ message: string }> {
    await this.categoriesService.remove(id, userId);
    return { message: 'Categoria removida com sucesso' };
  }
}
