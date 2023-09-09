import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './base.entity';
import { UserEntity } from './user.entity';
import { TicketEntity } from './ticket.entity';

@Entity('bank_accounts')
export class BankAccountEntity extends BaseEntity {
  @Column({ name: 'bank_name', nullable: false })
  bankName: string;

  @Column({
    name: 'account_name',
    nullable: false,
  })
  accountName: string;

  @Column({
    name: 'account_number',
    nullable: false,
  })
  accountNumber: string;

  @Column({ name: 'swift_code', nullable: true })
  swiftCode: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.bankAccounts)
  user: UserEntity;

  @OneToMany(() => TicketEntity, (ticketEntity) => ticketEntity.bankAccount)
  tickets: TicketEntity[];
}
