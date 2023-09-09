import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BudgetEntity } from './budget.entity';
import { ItemEntity } from './Item.entity';
import BaseEntity from './base.entity';
import { TicketItemEntity } from './ticketItem.entity';

@Entity('budget_categories')
export class BudgetCategoryEntity extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => BudgetEntity, (budgetEntity) => budgetEntity.categories)
  @JoinColumn({ name: 'budget_id' })
  budget: BudgetEntity;

  @OneToMany(() => ItemEntity, (itemEntity) => itemEntity.category)
  items: ItemEntity[];

  @OneToMany(
    () => TicketItemEntity,
    (ticketItemEntity) => ticketItemEntity.ticket,
  )
  ticketItems: TicketItemEntity[];
}
