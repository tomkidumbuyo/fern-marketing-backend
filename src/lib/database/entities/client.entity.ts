import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from './base.entity';
import { ProjectEntity } from './project.entity';

@Entity('clients')
export class ClientEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany((type) => ProjectEntity, (projectEntity) => projectEntity.client)
  projects: ProjectEntity[];
}
