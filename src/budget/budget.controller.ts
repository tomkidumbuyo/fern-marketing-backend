import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import {
  SaveBudgetInputDto,
  clientApprovalDto,
} from '@database/dtos/budget.dto';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get('getProjectBudget/:projectId')
  getProjectBudget(@Request() req) {
    return this.budgetService.getProjectBudget(req.params.projectId);
  }

  @Post('save')
  saveBudget(@Request() req, @Body() saveBudgetInput: SaveBudgetInputDto) {
    return this.budgetService.saveBudget(saveBudgetInput, req.user);
  }

  @Get(':budgetId')
  getBudgetById(@Request() req) {
    return this.budgetService.getBudgetById(req.params.budgetId);
  }

  @Get(':budgetId/approveBudget/:approvalType')
  approveBudget(@Request() req) {
    return this.budgetService.approveBudget(
      req.params.budgetId,
      req.params.approvalType,
      req.user,
    );
  }

  @Get(':budgetId/cancelBudgetApproval/:approvalType')
  cancelBudgetApproval(@Request() req) {
    return this.budgetService.cancelBudgetApproval(
      req.params.budgetId,
      req.params.approvalType,
      req.user,
    );
  }

  @Get(':budgetId/budgetDeclinedByClient')
  budgetDeclinedByClient(@Request() req) {
    return this.budgetService.budgetDeclinedByClient(req.params.budgetId);
  }

  @Post(':budgetId/budgetVerifiedByClient')
  budgetVerifiedByClient(
    @Request() req,
    @Body() clientApprovalInput: clientApprovalDto,
  ) {
    return this.budgetService.budgetVerifiedByClient(
      req.params.budgetId,
      clientApprovalInput.purchaseOrder
        ? clientApprovalInput.purchaseOrder
        : null,
    );
  }
}
