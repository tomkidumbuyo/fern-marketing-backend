import { HttpException, HttpStatus } from '@nestjs/common';

const ERROR_CREATING_NEW_PROJECT = 'ERROR_CREATING_NEW_PROJECT';

export class ErrorCreatingNewProject extends HttpException {
  constructor() {
    super(ERROR_CREATING_NEW_PROJECT, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
