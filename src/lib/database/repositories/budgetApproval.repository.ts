import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BudgetApprovalEntity } from '@database/entities';

@Injectable()
export class BudgetApprovalRepository extends BaseRepository<BudgetApprovalEntity> {
  constructor(private dataSource: DataSource) {
    super(BudgetApprovalEntity, dataSource.createEntityManager());
  }
}
