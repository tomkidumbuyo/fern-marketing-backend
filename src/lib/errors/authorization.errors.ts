import { HttpException, HttpStatus } from '@nestjs/common';

const ADMIN_AUTHORIZATION_REQUIRED = 'ADMIN_AUTHORIZATION_REQUIRED';

export class AdminAuthorizationRequired extends HttpException {
  constructor() {
    super(ADMIN_AUTHORIZATION_REQUIRED, HttpStatus.UNAUTHORIZED);
  }
}
