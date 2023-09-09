import { HttpException, HttpStatus } from '@nestjs/common';

const ERROR_CREATING_NEW_CLIENT = 'ERROR_CREATING_NEW_CLIENT';

export class ErrorCreatingNewClient extends HttpException {
  constructor() {
    super(ERROR_CREATING_NEW_CLIENT, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
