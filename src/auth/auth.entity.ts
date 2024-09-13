import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Test212') // Name of the table in your database
export class User {
  @PrimaryGeneratedColumn()
  'TAU_ID': number;

  @Column({ name: 'TAU_LoginName' })
  userName: string;

  @Column({ name: 'TAU_Password1' })
  password: string;
}
