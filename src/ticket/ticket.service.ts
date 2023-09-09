import { TicketApprovalTypesEnum, TicketDTO } from '@database/dtos/ticket.dto';
import {
  BankAccountEntity,
  TicketApprovalEntity,
  UserEntity,
} from '@database/entities';
import {
  TicketEntity,
  TicketPaymentMethodEnum,
  TicketStatusEnum,
} from '@database/entities/ticket.entity';
import { TicketItemEntity } from '@database/entities/ticketItem.entity';
import {
  TicketRepository,
  TicketItemRepository,
  BudgetRepository,
  BudgetCategoryRepository,
  ProjectRepository,
  ItemRepository,
  BankAccountRepository,
} from '@database/repositories';
import { TicketApprovalRepository } from '@database/repositories/ticketApproval.repository';
import { Injectable } from '@nestjs/common';
import * as errors from '@errors';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketItemRepository: TicketItemRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly budgetRepository: BudgetRepository,
    private readonly budgetCategoryRepository: BudgetCategoryRepository,
    private readonly itemRepository: ItemRepository,
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly ticketApprovalRepository: TicketApprovalRepository,
  ) {}

  async createTicket(createTicketInput: TicketDTO, user: UserEntity) {
    let ticket: TicketEntity = new TicketEntity();
    if (createTicketInput.id && createTicketInput.id != '') {
      ticket = await this.ticketRepository.findById(createTicketInput.id);
    } else {
      ticket.createdBy = user;
    }
    ticket.budget = await this.budgetRepository.findById(
      createTicketInput.budget,
    );
    ticket.status = createTicketInput.saveAsDraft
      ? TicketStatusEnum.DRAFT
      : TicketStatusEnum.CREATED;
    ticket.project = await this.projectRepository.findById(
      createTicketInput.project,
    );
    ticket.paymentMethod = createTicketInput.paymentMethod;

    const items = [];
    for (const item of createTicketInput.items) {
      let ticketItemEntity: TicketItemEntity = new TicketItemEntity();
      if (item.id && item.id != '') {
        ticketItemEntity = await this.ticketItemRepository.findById(item.id);
      }
      if (item.deleted) {
        this.ticketItemRepository.delete(ticketItemEntity);
      } else {
        ticketItemEntity.budgetCategory =
          await this.budgetCategoryRepository.findById(item.budgetItemCategory);
        ticketItemEntity.budgetItem = await this.itemRepository.findById(
          item.budgetItem,
        );
        ticketItemEntity.quantity = item.quantity;
        ticketItemEntity.unitPrice = item.unitPrice;
        ticketItemEntity.description = item.description;
        ticketItemEntity = await this.ticketItemRepository.save(
          ticketItemEntity,
        );
        items.push(ticketItemEntity);
      }
    }
    ticket.items = items;

    if (
      createTicketInput.paymentMethod == TicketPaymentMethodEnum.BANK_ACCOUNT
    ) {
      let account = new BankAccountEntity();
      if (createTicketInput.bankAccount !== '0') {
        account = await this.bankAccountRepository.findById(
          createTicketInput.bankAccount,
        );
      }
      account.accountName = createTicketInput.accountName;
      account.accountNumber = createTicketInput.accountNumber;
      account.bankName = createTicketInput.bankName;
      account.swiftCode = createTicketInput.swiftCode;
      account.user = user;
      account = await this.bankAccountRepository.save(account);
      ticket.bankAccount = account;
    }

    return this.ticketRepository.save(ticket);
  }

  async getTickets(user: UserEntity) {
    return this.ticketRepository.find({
      relations: [
        'bankAccount',
        'createdBy',
        'items',
        'items.budgetItem',
        'items.budgetCategory',
        'project',
        'project.client',
        'budget',
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
        'financeApproval.approvedBy',
        'headOfOperationsApproval.approvedBy',
        'managingDirectorApproval.approvedBy',
      ],
    });
  }

  async getTicketById(ticketId: string) {
    return this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: [
        'bankAccount',
        'bankAccount.user',
        'createdBy',
        'items',
        'items.budgetItem',
        'items.budgetCategory',
        'project',
        'project.client',
        'budget',
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
        'financeApproval.approvedBy',
        'headOfOperationsApproval.approvedBy',
        'managingDirectorApproval.approvedBy',
      ],
    });
  }

  async deleteTicketById(ticketId: any) {
    await this.ticketItemRepository.delete({ ticket: { id: ticketId } });
    return this.ticketRepository.delete(ticketId);
  }

  async approveTicket(
    ticketId: string,
    approvalType: string,
    user: UserEntity,
  ) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: [
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
      ],
    });
    if (approvalType == TicketApprovalTypesEnum.FINANCE) {
      let approval = new TicketApprovalEntity();
      approval.approvedBy = user;
      approval = await this.ticketApprovalRepository.save(approval);
      ticket.financeApproval = approval;
    }

    if (approvalType == TicketApprovalTypesEnum.HEAD_OF_OPERATIONS) {
      let approval = new TicketApprovalEntity();
      approval.approvedBy = user;
      approval = await this.ticketApprovalRepository.save(approval);
      ticket.headOfOperationsApproval = approval;
    }

    if (approvalType == TicketApprovalTypesEnum.MANAGING_DIRECTOR) {
      let approval = new TicketApprovalEntity();
      approval.approvedBy = user;
      approval = await this.ticketApprovalRepository.save(approval);
      ticket.managingDirectorApproval = approval;
    }

    if (
      ticket.managingDirectorApproval &&
      ticket.headOfOperationsApproval &&
      ticket.financeApproval
    ) {
      ticket.status = TicketStatusEnum.APPROVED;
    }
    return this.ticketRepository.save(ticket);
  }

  async cancelTicketApproval(
    ticketId: string,
    approvalType: string,
    user: UserEntity,
  ) {
    let ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: [
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
      ],
    });

    if (
      approvalType == TicketApprovalTypesEnum.FINANCE &&
      ticket.financeApproval
    ) {
      const financeApproval = ticket.financeApproval;
      ticket.financeApproval = null;
      ticket.status = TicketStatusEnum.CREATED;
      ticket = await this.ticketRepository.save(ticket);
      await this.ticketApprovalRepository.remove(financeApproval);
    }

    if (
      approvalType == TicketApprovalTypesEnum.HEAD_OF_OPERATIONS &&
      ticket.headOfOperationsApproval
    ) {
      const headOfOperationsApproval = ticket.headOfOperationsApproval;
      ticket.headOfOperationsApproval = null;
      ticket.status = TicketStatusEnum.CREATED;
      ticket = await this.ticketRepository.save(ticket);
      await this.ticketApprovalRepository.remove(headOfOperationsApproval);
    }

    if (
      approvalType == TicketApprovalTypesEnum.MANAGING_DIRECTOR &&
      ticket.managingDirectorApproval
    ) {
      const managingDirectorApproval = ticket.managingDirectorApproval;
      ticket.financeApproval = null;
      ticket.status = TicketStatusEnum.CREATED;
      ticket = await this.ticketRepository.save(ticket);
      await this.ticketApprovalRepository.remove(managingDirectorApproval);
      ticket.managingDirectorApproval = null;
    }
    return ticket;
  }

  async markTicketAsUnpaid(ticketId: any, user: UserEntity) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    if (ticket.status !== TicketStatusEnum.PAID) {
    }
    ticket.status = TicketStatusEnum.APPROVED;
    this.ticketItemRepository.save(ticket);
  }

  async markTicketAsPaid(ticketId: any, user: UserEntity) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    if (ticket.status !== TicketStatusEnum.APPROVED) {
    }
    ticket.status = TicketStatusEnum.PAID;
    this.ticketItemRepository.save(ticket);
  }
}
