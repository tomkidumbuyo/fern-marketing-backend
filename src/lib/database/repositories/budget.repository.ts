import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BudgetEntity } from '@database/entities';

@Injectable()
export class BudgetRepository extends BaseRepository<BudgetEntity> {
  constructor(private dataSource: DataSource) {
    super(BudgetEntity, dataSource.createEntityManager());
  }
}
