import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; accessToken: string }> {
    // Verificar se email já existe
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Criar usuário
    const user = await this.usersService.create(registerDto);

    // Gerar token
    const accessToken = await this.generateToken(user);

    return { user, accessToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    // Buscar usuário pelo email
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Validar senha
    const isPasswordValid = await user.validatePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Gerar token
    const accessToken = await this.generateToken(user);

    return { user, accessToken };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await user.validatePassword(password))) {
      return user;
    }

    return null;
  }

  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  async refreshToken(user: User): Promise<{ accessToken: string }> {
    const accessToken = await this.generateToken(user);
    return { accessToken };
  }

  async getProfile(userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  async updateProfile(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    return await this.usersService.update(userId, updateData);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.usersService.findOne(userId);

    // Validar senha atual
    const isCurrentPasswordValid = await user.validatePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    // Atualizar senha
    await this.usersService.updatePassword(userId, newPassword);
  }
}
