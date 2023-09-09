import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TicketApprovalEntity } from '@database/entities';

@Injectable()
export class TicketApprovalRepository extends BaseRepository<TicketApprovalEntity> {
  constructor(private dataSource: DataSource) {
    super(TicketApprovalEntity, dataSource.createEntityManager());
  }
}
