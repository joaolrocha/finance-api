import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Senha é obrigatória' })
  @MinLength(1, { message: 'Senha não pode estar vazia' })
  password: string;
}
