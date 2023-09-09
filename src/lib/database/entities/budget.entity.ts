import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BudgetCategoryEntity, ProjectEntity, UserEntity } from '.';
import BaseEntity from './base.entity';
import { BudgetApprovalEntity } from './budgetApproval.entity';
import { TicketEntity } from './ticket.entity';

export enum ClientApprovalTypeEnum {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  EMAIL = 'EMAIL',
}

export enum BudgetStatusEnum {
  DRAFT = 'DRAFT',
  CREATED = 'CREATED',
  INTERNAL_APPROVED = 'INTERNAL_APPROVED',
  CLIENT_APPROVED = 'CLIENT_APPROVED',
  CLIENT_DENIED = 'CLIENT_DENIED',
}

@Entity('budgets')
export class BudgetEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'client_approval_type' })
  clientApprovalType: ClientApprovalTypeEnum;

  @Column({ type: 'longtext' })
  description: string;

  @Column()
  status: BudgetStatusEnum;

  @ManyToOne(() => ProjectEntity, (projectEntity) => projectEntity.budgets)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @OneToMany(
    () => BudgetCategoryEntity,
    (budgetCategoryEntity) => budgetCategoryEntity.budget,
  )
  categories: BudgetCategoryEntity[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.budgets)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @ManyToOne(() => BudgetApprovalEntity, { cascade: true, nullable: true })
  @JoinColumn({ name: 'finance_approval' })
  financeApproval: BudgetApprovalEntity;

  @ManyToOne(() => BudgetApprovalEntity, { cascade: true, nullable: true })
  @JoinColumn({ name: 'head_of_operations_approval' })
  headOfOperationsApproval: BudgetApprovalEntity;

  @ManyToOne(() => BudgetApprovalEntity, { cascade: true, nullable: true })
  @JoinColumn({ name: 'managing_director_approval' })
  managingDirectorApproval: BudgetApprovalEntity;

  @Column({ name: 'purchase_order', nullable: true })
  purchaseOrder: string;

  @OneToMany(() => TicketEntity, (ticketEntity) => ticketEntity.budget)
  tickets: TicketEntity[];
}
