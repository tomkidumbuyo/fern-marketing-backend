import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { TicketDTO } from '@database/dtos/ticket.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';

@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('save')
  createTicket(@Request() req, @Body() ticketDTO: TicketDTO) {
    return this.ticketService.createTicket(ticketDTO, req.user);
  }

  @Get('getTickets')
  getTickets(@Request() req) {
    return this.ticketService.getTickets(req.user);
  }

  @Get(':ticketId')
  getTicketById(@Request() req, @Param() params) {
    return this.ticketService.getTicketById(params.ticketId);
  }

  @Delete(':ticketId')
  deleteTicketById(@Request() req, @Param() params) {
    return this.ticketService.deleteTicketById(params.ticketId);
  }

  @Get(':ticketId/approveBudget/:approvalType')
  approveTicket(@Request() req) {
    return this.ticketService.approveTicket(
      req.params.ticketId,
      req.params.approvalType,
      req.user,
    );
  }

  @Get(':ticketId/cancelTicketApproval/:approvalType')
  cancelTicketApproval(@Request() req) {
    return this.ticketService.cancelTicketApproval(
      req.params.ticketId,
      req.params.approvalType,
      req.user,
    );
  }

  @Get(':ticketId/markTicketAsPaid')
  markTicketAsPaid(@Request() req) {
    return this.ticketService.markTicketAsPaid(req.params.ticketId, req.user);
  }

  @Get(':ticketId/markTicketAsUnpaid')
  markTicketAsUnpaid(@Request() req) {
    return this.ticketService.markTicketAsUnpaid(req.params.ticketId, req.user);
  }
}
