import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TicketEntity } from '@database/entities/ticket.entity';

@Injectable()
export class TicketRepository extends BaseRepository<TicketEntity> {
  constructor(private dataSource: DataSource) {
    super(TicketEntity, dataSource.createEntityManager());
  }
}
