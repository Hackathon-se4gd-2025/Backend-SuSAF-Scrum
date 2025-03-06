import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSprintDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  end: Date;

  @IsOptional()
  @IsArray()
  items?: Types.ObjectId[];
}

export class UpdateSprintDto extends CreateSprintDto {}