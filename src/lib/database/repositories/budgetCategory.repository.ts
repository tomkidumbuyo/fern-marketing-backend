import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BudgetCategoryEntity } from '@database/entities';

@Injectable()
export class BudgetCategoryRepository extends BaseRepository<BudgetCategoryEntity> {
  constructor(private dataSource: DataSource) {
    super(BudgetCategoryEntity, dataSource.createEntityManager());
  }
}
