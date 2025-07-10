import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar se categoria com mesmo nome já existe para o usuário
    if (createCategoryDto.userId) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: createCategoryDto.name,
          userId: createCategoryDto.userId,
          isActive: true,
        },
      });

      if (existingCategory) {
        throw new ConflictException('Já existe uma categoria com esse nome');
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(userId?: string, type?: CategoryType): Promise<Category[]> {
    const where: any = { isActive: true };

    // Buscar categorias do usuário + categorias padrão
    if (userId) {
      where.userId = userId;
    } else {
      where.isDefault = true; // Apenas categorias padrão se não tiver userId
    }

    if (type) {
      where.type = type;
    }

    return await this.categoryRepository.find({
      where,
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async findAllForUser(
    userId: string,
    type?: CategoryType,
  ): Promise<Category[]> {
    const where: any = [
      { isActive: true, userId }, // Categorias do usuário
      { isActive: true, isDefault: true }, // Categorias padrão
    ];

    if (type) {
      where.forEach((condition) => (condition.type = type));
    }

    return await this.categoryRepository.find({
      where,
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string, userId?: string): Promise<Category> {
    const where: any = { id, isActive: true };

    if (userId) {
      // Usuário pode ver suas categorias + categorias padrão
      where.userId = userId;
    }

    const category = await this.categoryRepository.findOne({ where });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId?: string,
  ): Promise<Category> {
    const category = await this.findOne(id, userId);

    // Não permitir editar categorias padrão
    if (category.isDefault) {
      throw new ConflictException('Não é possível editar categorias padrão');
    }

    // Verificar nome único se estiver sendo alterado
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name,
          userId: category.userId,
          isActive: true,
        },
      });

      if (existingCategory) {
        throw new ConflictException('Já existe uma categoria com esse nome');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const category = await this.findOne(id, userId);

    // Não permitir remover categorias padrão
    if (category.isDefault) {
      throw new ConflictException('Não é possível remover categorias padrão');
    }

    // Soft delete
    category.isActive = false;
    await this.categoryRepository.save(category);
  }

  // Método para criar categorias padrão do sistema
  async createDefaultCategories(): Promise<Category[]> {
    const defaultCategories = [
      // Receitas
      {
        name: 'Salário',
        color: '#4CAF50',
        icon: 'salary',
        type: CategoryType.INCOME,
        isDefault: true,
      },
      {
        name: 'Freelance',
        color: '#2196F3',
        icon: 'work',
        type: CategoryType.INCOME,
        isDefault: true,
      },
      {
        name: 'Investimentos',
        color: '#FF9800',
        icon: 'trending-up',
        type: CategoryType.INCOME,
        isDefault: true,
      },
      {
        name: 'Outros',
        color: '#9C27B0',
        icon: 'cash',
        type: CategoryType.INCOME,
        isDefault: true,
      },

      // Despesas
      {
        name: 'Alimentação',
        color: '#F44336',
        icon: 'restaurant',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
      {
        name: 'Transporte',
        color: '#3F51B5',
        icon: 'car',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
      {
        name: 'Moradia',
        color: '#795548',
        icon: 'home',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
      {
        name: 'Saúde',
        color: '#E91E63',
        icon: 'medical',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
      {
        name: 'Educação',
        color: '#607D8B',
        icon: 'school',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
      {
        name: 'Lazer',
        color: '#00BCD4',
        icon: 'game-controller',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
      {
        name: 'Compras',
        color: '#8BC34A',
        icon: 'bag',
        type: CategoryType.EXPENSE,
        isDefault: true,
      },
    ];

    const categories = [];

    for (const categoryData of defaultCategories) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: categoryData.name, isDefault: true },
      });

      if (!existingCategory) {
        const category = this.categoryRepository.create(categoryData);
        categories.push(await this.categoryRepository.save(category));
      }
    }

    return categories;
  }
}
