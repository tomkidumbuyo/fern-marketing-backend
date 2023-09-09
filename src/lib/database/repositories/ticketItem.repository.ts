import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TicketItemEntity } from '@database/entities/ticketItem.entity';

@Injectable()
export class TicketItemRepository extends BaseRepository<TicketItemEntity> {
  constructor(private dataSource: DataSource) {
    super(TicketItemEntity, dataSource.createEntityManager());
  }
}
