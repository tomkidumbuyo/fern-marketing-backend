import { BudgetRepository } from './budget.repository';
import { BudgetApprovalRepository } from './budgetApproval.repository';
import { BudgetCategoryRepository } from './budgetCategory.repository';
import { ClientRepository } from './client.repository';
import { ItemRepository } from './item.repository';
import { ProjectRepository } from './project.repository';
import { UserRepository } from './user.repository';
import { BankAccountRepository } from './bankAccount.repository';
import { TicketItemRepository } from './ticketItem.repository';
import { TicketRepository } from './ticket.repository';
import { TicketApprovalRepository } from './ticketApproval.repository';

export const repositories = [
  UserRepository,
  ClientRepository,
  ProjectRepository,
  BudgetRepository,
  ItemRepository,
  BudgetCategoryRepository,
  BudgetApprovalRepository,
  BankAccountRepository,
  TicketItemRepository,
  TicketRepository,
  TicketApprovalRepository,
];

export * from './user.repository';
export * from './client.repository';
export * from './project.repository';
export * from './budget.repository';
export * from './budgetCategory.repository';
export * from './item.repository';
export * from './budgetApproval.repository';
export * from './bankAccount.repository';
export * from './ticket.repository';
export * from './ticketItem.repository';
export * from './ticketApproval.repository';
