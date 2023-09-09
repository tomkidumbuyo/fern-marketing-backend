import { GenderEnum, UserTypeEnum } from '@database/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserWithNoPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  @ApiProperty()
  userType: UserTypeEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  gender: GenderEnum;
}
