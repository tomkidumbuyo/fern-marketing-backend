import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './base.entity';
import { ProjectEntity } from './project.entity';
import { BudgetEntity } from './budget.entity';
import { BankAccountEntity } from './bankAccount.entity';
import { TicketEntity } from './ticket.entity';

export enum UserTypeEnum {
  HEAD_OPERATION_MANAGER = 'HEAD_OPERATION_MANAGER',
  OPERATION_MANAGER = 'OPERATION_MANAGER',
  MANAGING_DIRECTOR = 'MANAGING_DIRECTOR',
  FINANCE = 'FINANCE',
  ADMIN = 'ADMIN',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'user_type' })
  userType: UserTypeEnum;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ name: 'gender' })
  gender: GenderEnum;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.created)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: UserEntity | null;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.updated)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: UserEntity | null;

  @Column({ name: 'no_password_set', default: false })
  noPasswordSet: boolean;

  @Column({ name: 'create_password_token', select: false, nullable: true })
  createPasswordToken: string;

  @Column({
    name: 'create_password_token_expires',
    type: 'timestamp',
    nullable: true,
  })
  createPasswordTokenExpires: Date;

  @OneToMany((type) => UserEntity, (userEntity) => userEntity.createdBy)
  created: UserEntity[];

  @OneToMany((type) => UserEntity, (userEntity) => userEntity.updatedBy)
  updated: UserEntity[];

  @OneToMany(
    (type) => ProjectEntity,
    (projectEntity) => projectEntity.operationManager,
  )
  projects_managed: ProjectEntity[];

  @OneToMany(
    (type) => ProjectEntity,
    (projectEntity) => projectEntity.createdBy,
  )
  projects_created: ProjectEntity[];

  @OneToMany((type) => BudgetEntity, (budgetEntity) => budgetEntity.createdBy)
  budgets: BudgetEntity[];

  @OneToMany(
    () => BankAccountEntity,
    (bankAccountEntity) => bankAccountEntity.user,
  )
  bankAccounts: BankAccountEntity[];

  @OneToMany(() => TicketEntity, (ticketEntity) => ticketEntity.createdBy)
  tickets: TicketEntity[];
}
