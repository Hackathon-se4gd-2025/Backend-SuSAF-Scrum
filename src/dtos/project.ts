import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  sprints?: Types.ObjectId[];

  @IsOptional()
  @IsArray()
  items?: Types.ObjectId[];
}

export class UpdateProjectDto extends CreateProjectDto {}