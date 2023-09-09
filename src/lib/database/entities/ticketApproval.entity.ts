import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import BaseEntity from './base.entity';
import { UserEntity } from './user.entity';

@Entity('budget_approvals')
export class TicketApprovalEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.projects_created)
  @JoinColumn({ name: 'approved_by' })
  approvedBy: UserEntity;
}
