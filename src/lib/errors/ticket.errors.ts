import { HttpException, HttpStatus } from '@nestjs/common';

const ERROR_UPDATING_TICKET_AS_PAID = 'ERROR_UPDATING_TICKET_AS_PAID';
const ERROR_UPDATING_TICKET_AS_UNPAID = 'ERROR_UPDATING_TICKET_AS_UNPAID';

export class ErrorUpdatingTicketAsPaid extends HttpException {
  constructor() {
    super(ERROR_UPDATING_TICKET_AS_PAID, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ErrorUpdatingTicketAsUnpaid extends HttpException {
  constructor() {
    super(ERROR_UPDATING_TICKET_AS_UNPAID, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
