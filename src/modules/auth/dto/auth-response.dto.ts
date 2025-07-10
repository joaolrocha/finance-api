import { Expose } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class AuthResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  tokenType: string = 'Bearer';

  @Expose()
  expiresIn: string;

  @Expose()
  user: UserResponseDto;
}
