import { TicketPaymentMethodEnum } from '@database/entities/ticket.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum TicketApprovalTypesEnum {
  HEAD_OF_OPERATIONS = 'HEAD_OF_OPERATIONS',
  FINANCE = 'FINANCE',
  MANAGING_DIRECTOR = 'MANAGING_DIRECTOR',
}

export class TicketItemDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  budgetItemCategory: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  budgetItem: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  unitPrice: number;

  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty()
  @IsBoolean()
  @ApiProperty()
  deleted: boolean;
}

export class TicketDTO {
  @IsString()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty()
  @IsBoolean()
  @ApiProperty()
  saveAsDraft: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  project: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  budget: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketItemDTO)
  items: TicketItemDTO[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  bankAccount?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bankName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  accountName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  swiftCode?: string;

  @IsEnum(TicketPaymentMethodEnum)
  @IsNotEmpty()
  @ApiProperty()
  paymentMethod: TicketPaymentMethodEnum;
}
