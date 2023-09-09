import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BudgetCategoryEntity } from './budgetCategory.entity';
import BaseEntity from './base.entity';
import { TicketItemEntity } from './ticketItem.entity';

@Entity('items')
export class ItemEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column({ name: 'internal_price_each' })
  internalPriceEach: number;

  @Column({ name: 'client_price_each' })
  clientPriceEach: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    () => BudgetCategoryEntity,
    (budgetCategoryEntity) => budgetCategoryEntity.items,
  )
  category: BudgetCategoryEntity;

  @OneToMany(
    () => TicketItemEntity,
    (ticketItemEntity) => ticketItemEntity.ticket,
  )
  ticketItems: TicketItemEntity[];
}
