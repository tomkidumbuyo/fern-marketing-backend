import { Column, Entity, ManyToOne } from 'typeorm';
import { TicketEntity } from './ticket.entity';
import BaseEntity from './base.entity';
import { BudgetCategoryEntity } from './budgetCategory.entity';
import { ItemEntity } from './Item.entity';

@Entity('ticket_items')
export class TicketItemEntity extends BaseEntity {
  @ManyToOne(() => TicketEntity, (ticketEntity) => ticketEntity.items)
  ticket: TicketEntity;

  @ManyToOne(
    () => BudgetCategoryEntity,
    (budgetCategoryEntity) => budgetCategoryEntity.ticketItems,
  )
  budgetCategory: BudgetCategoryEntity;

  @ManyToOne(() => ItemEntity, (itemEntity) => itemEntity.ticketItems)
  budgetItem: ItemEntity;

  @Column({})
  description: string;

  @Column({})
  quantity: number;

  @Column({ name: 'unit_price' })
  unitPrice: number;
}
