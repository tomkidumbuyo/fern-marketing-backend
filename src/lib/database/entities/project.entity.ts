import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './base.entity';
import { ClientEntity } from './client.entity';
import { UserEntity } from './user.entity';
import { BudgetEntity } from './budget.entity';
import { TicketEntity } from './ticket.entity';

export enum projectStatusEnum {
  CREATED = 'CREATED',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
}

@Entity('projects')
export class ProjectEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'start_date', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime' })
  endDate: Date;

  @ManyToOne(() => ClientEntity, (clientEntity) => clientEntity.projects)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ type: 'longtext' })
  description: string;

  @Column({ default: projectStatusEnum.CREATED })
  status: projectStatusEnum;

  @OneToMany(() => BudgetEntity, (budget) => budget.project, { cascade: true })
  budgets: BudgetEntity[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.projects_managed)
  @JoinColumn({ name: 'operation_manager' })
  operationManager: UserEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.projects_created)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @OneToMany(() => TicketEntity, (ticketEntity) => ticketEntity.project)
  tickets: TicketEntity[];
}
