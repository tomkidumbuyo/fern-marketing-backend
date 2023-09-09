import { RegisterDto } from '@database/dtos/auth.dto';
import { UserWithNoPasswordDto } from '@database/dtos/user.dto';
import { UserEntity, UserTypeEnum } from '@database/entities';

import { BankAccountRepository, UserRepository } from '@database/repositories';
import { Injectable } from '@nestjs/common';
import * as errors from '@errors';
import * as crypto from 'crypto';
import { AuthMailService } from 'src/lib/mail/auth.mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly authMailService: AuthMailService,
  ) {}

  async findOne(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(registerInput: RegisterDto) {
    if (await this.findOne(registerInput.email))
      throw new errors.UserAlreadyExist();
    return this.userRepository.insert({
      ...registerInput,
    });
  }

  async createUserWithNoPassword(
    userWithNoPasswordInput: UserWithNoPasswordDto,
    user: UserEntity,
  ) {
    if (await this.findOne(userWithNoPasswordInput.email))
      throw new errors.UserAlreadyExist();
    if (user.userType !== UserTypeEnum.ADMIN)
      throw new errors.AdminAuthorizationRequired();

    const result = await this.userRepository.insert({
      ...userWithNoPasswordInput,
      createdBy: user,
      noPasswordSet: true,
    });

    if (result.identifiers.length == 0) {
      throw new errors.ErrorInsertingNewUser();
    }

    const insertedUser = await this.userRepository.findById(
      result.identifiers[0].id,
    );
    await this.createUserPasswordToken(insertedUser);
    return insertedUser;
  }

  async createUserPasswordToken(user: UserEntity) {
    const token = crypto.randomBytes(20).toString('hex');
    user.createPasswordToken = token;
    user.createPasswordTokenExpires = new Date(Date.now() + 360000);
    this.userRepository.save(user);
    this.authMailService.sendUserCreatePassword(user, token);
  }

  async getAllUsers() {
    return await this.userRepository.find({});
  }

  async getOperationManagers() {
    return await this.userRepository.find({
      where: { userType: UserTypeEnum.OPERATION_MANAGER },
    });
  }

  getUserBankAccounts(user: any) {
    return this.bankAccountRepository.find({
      where: { user: { id: user.id } },
    });
  }
}
