import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-goal.dto';

// Remove userId do update (não deve ser alterado)
export class UpdateGoalDto extends PartialType(
  OmitType(CreateGoalDto, ['userId'] as const),
) {}
