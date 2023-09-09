import { HttpException, HttpStatus } from '@nestjs/common';

const ERROR_INSERTING_NEW_USER = 'ERROR_INSERTING_NEW_USER';

export class ErrorInsertingNewUser extends HttpException {
  constructor() {
    super(ERROR_INSERTING_NEW_USER, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
