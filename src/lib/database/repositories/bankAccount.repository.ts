import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BankAccountEntity } from '@database/entities';

@Injectable()
export class BankAccountRepository extends BaseRepository<BankAccountEntity> {
  constructor(private dataSource: DataSource) {
    super(BankAccountEntity, dataSource.createEntityManager());
  }
}