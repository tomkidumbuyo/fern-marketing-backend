import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { UserWithNoPasswordDto } from '@database/dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('createUserWithNoPassword')
  createUserWithNoPassword(
    @Request() req,
    @Body() userWithNoPasswordInput: UserWithNoPasswordDto,
  ) {
    return this.userService.createUserWithNoPassword(
      userWithNoPasswordInput,
      req.user,
    );
  }

  @Get('getAllUsers')
  getAllUsers(@Request() req) {
    return this.userService.getAllUsers();
  }

  @Get('getOperationManagers')
  getOperationManagers(@Request() req) {
    return this.userService.getOperationManagers();
  }

  @Get('bankAccounts')
  getUserBankAccounts(@Request() req) {
    return this.userService.getUserBankAccounts(req.user);
  }
}
