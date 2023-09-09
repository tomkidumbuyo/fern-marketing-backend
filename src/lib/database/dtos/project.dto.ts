import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  client: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  operationManager: string;
}
