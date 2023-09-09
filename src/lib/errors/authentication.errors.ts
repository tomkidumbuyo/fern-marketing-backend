import { HttpException, HttpStatus } from '@nestjs/common';

const USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST';
const USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS';
const USERNAME_AND_PASSWORD_DO_NOT_MATCH = 'USERNAME_AND_PASSWORD_DO_NOT_MATCH';

export class UserDoesNotExist extends HttpException {
  constructor() {
    super(USER_DOES_NOT_EXIST, HttpStatus.UNAUTHORIZED);
  }
}

export class UsernameAndPasswordDoNotMatch extends HttpException {
  constructor() {
    super(USERNAME_AND_PASSWORD_DO_NOT_MATCH, HttpStatus.UNAUTHORIZED);
  }
}

export class UserAlreadyExist extends HttpException {
  constructor() {
    super(USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
  }
}
