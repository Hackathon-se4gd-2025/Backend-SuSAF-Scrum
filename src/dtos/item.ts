import { IsString, IsBoolean, IsNumber, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @IsNotEmpty()
  @IsBoolean()
  sustainability: boolean;

  @IsOptional()
  @IsNumber()
  storyPoints?: number;

  @IsOptional()
  @IsNumber()
  sustainabilityPoints?: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  effects?: string[];

  @IsOptional()
  @IsString()
  sprint?: string;

  @IsOptional()
  @IsString()
  responsible?: string;
}

export class UpdateItemDto extends CreateItemDto {}