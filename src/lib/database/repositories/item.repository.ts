import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { ItemEntity } from '@database/entities';

@Injectable()
export class ItemRepository extends BaseRepository<ItemEntity> {
  constructor(private dataSource: DataSource) {
    super(ItemEntity, dataSource.createEntityManager());
  }
}
