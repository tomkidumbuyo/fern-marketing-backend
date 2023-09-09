import { ClientEntity } from '@database/entities/client.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export class ClientRepository extends BaseRepository<ClientEntity> {
  constructor(private dataSource: DataSource) {
    super(ClientEntity, dataSource.createEntityManager());
  }
}
