import { ClientApprovalTypeEnum } from '@database/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ValidateNested,
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum BudgetApprovalTypesEnum {
  HEAD_OF_OPERATIONS = 'HEAD_OF_OPERATIONS',
  FINANCE = 'FINANCE',
  MANAGING_DIRECTOR = 'MANAGING_DIRECTOR',
}

export class BudgetItemDto {
  @ApiProperty()
  @IsOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  quantity: number;

  @IsString()
  @ApiProperty()
  unit: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  internalPriceEach: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  clientPriceEach: number;

  @IsString()
  @ApiProperty()
  description: string;

  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}

export class BudgetCategoryDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  id?: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetItemDto)
  items: BudgetItemDto[];

  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}

export class SaveBudgetInputDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(ClientApprovalTypeEnum)
  @IsNotEmpty()
  @ApiProperty()
  clientApprovalType: ClientApprovalTypeEnum;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  project: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  @ApiProperty()
  saveAsDraft: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetCategoryDto)
  categories: BudgetCategoryDto[];
}

export class clientApprovalDto {
  @IsString()
  @ApiProperty()
  purchaseOrder?: string;
}
