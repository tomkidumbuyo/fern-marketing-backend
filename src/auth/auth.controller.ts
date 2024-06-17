import { UserService } from 'src/users/user.service';
import { LoginDto, RegisterDto } from '@database/dtos/auth.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  async login(@Request() req, @Body() loginInput: LoginDto) {
    return this.authService.login(loginInput);
  }

  @Post('register')
  async register(@Request() req, @Body() registerInput: RegisterDto) {
    return this.authService.register(registerInput);
  }

  @Get('isAuthenticated')
  @UseGuards(JwtAuthGuard)
  isAuthenticated(@Request() req) {
    return true;
  }

  @Get('checkIfAnyUsersExist')
  checkIfAnyUsersExist(@Request() req) {
    return this.userService.checkIfAnyUsersExist();
  }
}
