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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo usuário no sistema. A senha será automaticamente hasheada antes de ser salva no banco de dados.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso por outro usuário',
  })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return plainToInstance(UserResponseDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários ativos',
    description:
      'Retorna lista de todos os usuários ativos do sistema, ordenados por data de criação (mais recentes primeiro).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => plainToInstance(UserResponseDto, user));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description:
      'Retorna os dados de um usuário específico baseado no seu ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário (UUID)',
    example: 'uuid-do-usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado ou inativo',
  })
  @ApiResponse({
    status: 400,
    description: 'ID fornecido não é um UUID válido',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar dados do usuário',
    description:
      'Atualiza os dados de um usuário existente. Campos não fornecidos permanecerão inalterados. Para alterar a senha, use o endpoint específico de mudança de senha.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário (UUID)',
    example: 'uuid-do-usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado ou inativo',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso por outro usuário',
  })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return plainToInstance(UserResponseDto, user);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover usuário (soft delete)',
    description:
      'Remove um usuário do sistema usando soft delete. O usuário será marcado como inativo mas seus dados permanecerão no banco para preservar integridade referencial.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário (UUID)',
    example: 'uuid-do-usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário removido com sucesso' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado ou já inativo',
  })
  @ApiResponse({
    status: 400,
    description: 'ID fornecido não é um UUID válido',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.remove(id);
    return { message: 'Usuário removido com sucesso' };
  }
}
