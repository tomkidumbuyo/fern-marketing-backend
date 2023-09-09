import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller('client')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('getAllClients')
  getAllClients(@Request() req) {
    return this.clientService.getAllClients();
  }
}
