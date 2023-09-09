import { BankAccountEntity } from './bankAccount.entity';
import { BudgetEntity } from './budget.entity';
import { BudgetApprovalEntity } from './budgetApproval.entity';
import { BudgetCategoryEntity } from './budgetCategory.entity';
import { ClientEntity } from './client.entity';
import { ItemEntity } from './item.entity';
import { ProjectEntity } from './project.entity';
import { TicketEntity } from './ticket.entity';
import { TicketApprovalEntity } from './ticketApproval.entity';
import { TicketItemEntity } from './ticketItem.entity';
import { UserEntity } from './user.entity';

const entities = [
  UserEntity,
  ClientEntity,
  ProjectEntity,
  ItemEntity,
  BudgetEntity,
  BudgetCategoryEntity,
  BudgetApprovalEntity,
  BankAccountEntity,
  TicketEntity,
  TicketItemEntity,
  TicketApprovalEntity,
];

export default entities;

export * from './user.entity';
export * from './client.entity';
export * from './project.entity';
export * from './budget.entity';
export * from './budgetCategory.entity';
export * from './Item.entity';
export * from './budgetApproval.entity';
export * from './bankAccount.entity';
export * from './ticketApproval.entity';
