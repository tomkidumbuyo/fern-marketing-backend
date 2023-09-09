import { GenderEnum, UserTypeEnum } from '@database/entities/user.entity';

export interface UserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: UserTypeEnum;
  gender: GenderEnum;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
