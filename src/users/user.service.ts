import { name } from './../../node_modules/@types/ejs/index.d';
import { RegisterDto } from '@database/dtos/auth.dto';
import { UserWithNoPasswordDto } from '@database/dtos/user.dto';
import { UserEntity, UserTypeEnum } from '@database/entities';

import { BankAccountRepository, UserRepository } from '@database/repositories';
import { Injectable } from '@nestjs/common';
import * as errors from '@errors';
import * as crypto from 'crypto';
import { MailService } from 'src/lib/mail/mail.service';
import e from 'express';
import { MailTemplatesEnum } from 'src/lib/mail/mail.config';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly mailService: MailService,
  ) {}

  async findOne(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(registerInput: RegisterDto) {
    if (await this.findOne(registerInput.email))
      throw new errors.UserAlreadyExist();
    const result = this.userRepository.insert({
      ...registerInput,
    });
    this.createUserEmailVerificationToken(registerInput.email);
    return result;
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
    this.mailService.sendEmailTemplate(
      user.email,
      'Create a new Password',
      MailTemplatesEnum.AUTHENTICATION_CREATE_PASSWORD,
      {
        name: user.firstName + ' ' + user.lastName,
        token: process.env.FRONTEND_URL + '/auth/create-password/' + token,
      },
    );
  }

  async createUserEmailVerificationToken(email: string) {
    const token = crypto.randomBytes(20).toString('hex');
    const user = await this.userRepository.findOne({ where: { email } })
    user.createPasswordToken = token;
    user.createPasswordTokenExpires = new Date(Date.now() + 360000);
    this.userRepository.save(user);
  }

  async getAllUsers() {
    return await this.userRepository.find({});
  }

  async checkIfAnyUsersExist() {
    const user = await this.userRepository.findOne({
      where: { id: Not(IsNull()) },
    });
    return user ? true : false;
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
