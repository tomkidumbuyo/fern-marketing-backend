import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TicketItemEntity } from './ticketItem.entity';
import BaseEntity from './base.entity';
import { BudgetEntity } from './budget.entity';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';
import { BankAccountEntity } from './bankAccount.entity';
import { TicketApprovalEntity } from './ticketApproval.entity';

export enum TicketPaymentMethodEnum {
  CASH = 'CASH',
  MOBILE_MONEY = 'MOBILE MONEY',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
}

export enum TicketStatusEnum {
  DRAFT = 'DRAFT',
  CREATED = 'CREATED',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
}

@Entity('tickets')
export class TicketEntity extends BaseEntity {
  @ManyToOne(() => BudgetEntity, (budgetEntity) => budgetEntity.tickets)
  budget: BudgetEntity;

  @ManyToOne(() => ProjectEntity, (projectEntity) => projectEntity.tickets)
  project: ProjectEntity;

  @OneToMany(
    () => TicketItemEntity,
    (ticketItemEntity) => ticketItemEntity.ticket,
  )
  items: TicketItemEntity[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.tickets)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @ManyToOne(
    () => BankAccountEntity,
    (bankAccountEntity) => bankAccountEntity.tickets,
  )
  @JoinColumn({ name: 'bank_account' })
  bankAccount: BankAccountEntity;

  @Column({ name: 'payment_method' })
  paymentMethod: TicketPaymentMethodEnum;

  @Column()
  status: TicketStatusEnum;

  @ManyToOne(() => TicketApprovalEntity, { cascade: true, nullable: true })
  @JoinColumn({ name: 'finance_approval' })
  financeApproval: TicketApprovalEntity;

  @ManyToOne(() => TicketApprovalEntity, { cascade: true, nullable: true })
  @JoinColumn({ name: 'head_of_operations_approval' })
  headOfOperationsApproval: TicketApprovalEntity;

  @ManyToOne(() => TicketApprovalEntity, { cascade: true, nullable: true })
  @JoinColumn({ name: 'managing_director_approval' })
  managingDirectorApproval: TicketApprovalEntity;
}
