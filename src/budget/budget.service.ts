import {
  BudgetApprovalTypesEnum,
  BudgetCategoryDto,
  BudgetItemDto,
  SaveBudgetInputDto,
} from '@database/dtos/budget.dto';
import {
  BudgetApprovalEntity,
  BudgetCategoryEntity,
  BudgetEntity,
  BudgetStatusEnum,
  ItemEntity,
  UserEntity,
} from '@database/entities';
import {
  BudgetCategoryRepository,
  BudgetRepository,
  ItemRepository,
  ProjectRepository,
} from '@database/repositories';
import { BudgetApprovalRepository } from '@database/repositories/budgetApproval.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BudgetService {
  constructor(
    private budgetRepository: BudgetRepository,
    private budgetCategoryRepository: BudgetCategoryRepository,
    private projectRepository: ProjectRepository,
    private itemRepository: ItemRepository,
    private budgetApprovalRepository: BudgetApprovalRepository,
  ) {}

  getBudgetById(budgetId: any) {
    return this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: [
        'tickets',
        'categories',
        'categories.items',
        'createdBy',
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
        'financeApproval.approvedBy',
        'headOfOperationsApproval.approvedBy',
        'managingDirectorApproval.approvedBy',
      ],
    });
  }

  async saveBudget(createBudgetInput: SaveBudgetInputDto, user: UserEntity) {
    this.verifyUserCanAddBudget();
    let budget: BudgetEntity = new BudgetEntity();
    if (!createBudgetInput.id || createBudgetInput.id === undefined) {
      budget.project = await this.projectRepository.findById(
        createBudgetInput.project,
      );
    } else {
      budget = await this.budgetRepository.findById(createBudgetInput.id);
    }

    budget.name = createBudgetInput.name;
    budget.clientApprovalType = createBudgetInput.clientApprovalType;
    budget.description = createBudgetInput.description;
    (budget.status = createBudgetInput.saveAsDraft
      ? BudgetStatusEnum.DRAFT
      : BudgetStatusEnum.CREATED),
      (budget.createdBy = user);
    budget = await this.budgetRepository.save(budget);

    for (const category of createBudgetInput.categories) {
      this.saveBudgetCategory(category, budget);
    }

    await this.cancelBudgetApproval(
      budget.id,
      BudgetApprovalTypesEnum.FINANCE,
      user,
    );
    await this.cancelBudgetApproval(
      budget.id,
      BudgetApprovalTypesEnum.HEAD_OF_OPERATIONS,
      user,
    );
    await this.cancelBudgetApproval(
      budget.id,
      BudgetApprovalTypesEnum.MANAGING_DIRECTOR,
      user,
    );
    return this.getBudgetById(budget.id);
  }

  async saveBudgetCategory(
    budgetCategoryInput: BudgetCategoryDto,
    budget: BudgetEntity,
  ) {
    if (budgetCategoryInput.id && budgetCategoryInput.deleted) {
      await this.budgetCategoryRepository.remove(
        await this.budgetCategoryRepository.findById(budgetCategoryInput.id),
      );
      return;
    }

    if (!budgetCategoryInput.id || budgetCategoryInput.id === undefined) {
      const result = await this.budgetCategoryRepository.insert({
        budget,
        name: budgetCategoryInput.name,
      });
      budgetCategoryInput.id = result.identifiers[0].id;
    }

    const budgetCategoryEntity: BudgetCategoryEntity =
      await this.budgetCategoryRepository.findById(budgetCategoryInput.id);

    if (budgetCategoryEntity.name !== budgetCategoryInput.name) {
      budgetCategoryEntity.name = budgetCategoryInput.name;
      await this.budgetCategoryRepository.save(budgetCategoryEntity);
    }

    for (const item of budgetCategoryInput.items) {
      this.saveBudgetItem(item, budgetCategoryEntity);
    }
  }

  async saveBudgetItem(
    budgetItemInput: BudgetItemDto,
    budgetCategoryEntity: BudgetCategoryEntity,
  ) {
    if (budgetItemInput.id) {
      const itemEntity: ItemEntity = await this.itemRepository.findById(
        budgetItemInput.id,
      );
      if (budgetItemInput.deleted) {
        this.itemRepository.remove(itemEntity);
        return;
      }
      itemEntity.category = budgetCategoryEntity;
      itemEntity.clientPriceEach = budgetItemInput.clientPriceEach;
      itemEntity.internalPriceEach = budgetItemInput.internalPriceEach;
      itemEntity.name = budgetItemInput.name;
      itemEntity.quantity = budgetItemInput.quantity;
      itemEntity.unit = budgetItemInput.unit;
      itemEntity.description = budgetItemInput.description;
      return this.itemRepository.save(itemEntity);
    }
    return this.itemRepository.insert({
      category: budgetCategoryEntity,
      clientPriceEach: budgetItemInput.clientPriceEach,
      internalPriceEach: budgetItemInput.internalPriceEach,
      name: budgetItemInput.name,
      quantity: budgetItemInput.quantity,
      unit: budgetItemInput.unit,
      description: budgetItemInput.description,
    });
  }

  verifyUserCanAddBudget() {
    return true;
  }

  async getProjectBudget(projectId: string) {
    return this.budgetRepository.find({
      where: { project: { id: projectId } },
      relations: [
        'categories',
        'categories.items',
        'createdBy',
        'tickets',
        'tickets.items',
      ],
    });
  }

  async approveBudget(
    budgetId: string,
    approvalType: string,
    user: UserEntity,
  ) {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: [
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
      ],
    });
    if (approvalType == BudgetApprovalTypesEnum.FINANCE) {
      let approval = new BudgetApprovalEntity();
      approval.approvedBy = user;
      approval = await this.budgetApprovalRepository.save(approval);
      budget.financeApproval = approval;
    }

    if (approvalType == BudgetApprovalTypesEnum.HEAD_OF_OPERATIONS) {
      let approval = new BudgetApprovalEntity();
      approval.approvedBy = user;
      approval = await this.budgetApprovalRepository.save(approval);
      budget.headOfOperationsApproval = approval;
    }

    if (approvalType == BudgetApprovalTypesEnum.MANAGING_DIRECTOR) {
      let approval = new BudgetApprovalEntity();
      approval.approvedBy = user;
      approval = await this.budgetApprovalRepository.save(approval);
      budget.managingDirectorApproval = approval;
    }

    if (
      budget.managingDirectorApproval &&
      budget.headOfOperationsApproval &&
      budget.financeApproval
    ) {
      budget.status = BudgetStatusEnum.INTERNAL_APPROVED;
    }
    return this.budgetRepository.save(budget);
  }

  async cancelBudgetApproval(
    budgetId: string,
    approvalType: string,
    user: UserEntity,
  ) {
    let budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: [
        'financeApproval',
        'headOfOperationsApproval',
        'managingDirectorApproval',
      ],
    });

    if (
      approvalType == BudgetApprovalTypesEnum.FINANCE &&
      budget.financeApproval
    ) {
      const financeApproval = budget.financeApproval;
      budget.financeApproval = null;
      budget.status = BudgetStatusEnum.CREATED;
      budget = await this.budgetRepository.save(budget);
      await this.budgetApprovalRepository.remove(financeApproval);
    }

    if (
      approvalType == BudgetApprovalTypesEnum.HEAD_OF_OPERATIONS &&
      budget.headOfOperationsApproval
    ) {
      const headOfOperationsApproval = budget.headOfOperationsApproval;
      budget.headOfOperationsApproval = null;
      budget.status = BudgetStatusEnum.CREATED;
      budget = await this.budgetRepository.save(budget);
      await this.budgetApprovalRepository.remove(headOfOperationsApproval);
    }

    if (
      approvalType == BudgetApprovalTypesEnum.MANAGING_DIRECTOR &&
      budget.managingDirectorApproval
    ) {
      const managingDirectorApproval = budget.managingDirectorApproval;
      budget.financeApproval = null;
      budget.status = BudgetStatusEnum.CREATED;
      budget = await this.budgetRepository.save(budget);
      await this.budgetApprovalRepository.remove(managingDirectorApproval);
      budget.managingDirectorApproval = null;
    }
    return budget;
  }

  async budgetDeclinedByClient(budgetId: any) {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
    });
    budget.financeApproval = null;
    budget.managingDirectorApproval = null;
    budget.headOfOperationsApproval = null;
    budget.status = BudgetStatusEnum.CLIENT_DENIED;
    return this.budgetRepository.save(budget);
  }

  async budgetVerifiedByClient(budgetId: any, purchaseOrder?: any) {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
    });
    budget.status = BudgetStatusEnum.CLIENT_APPROVED;
    budget.purchaseOrder = purchaseOrder;
    return await this.budgetRepository.save(budget);
  }
}
