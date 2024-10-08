import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Entity_Property') // Ensure this matches the actual table name in your database
export class EntityPropertyEntity {
  @PrimaryGeneratedColumn()
  EP_ID: number;

  @Column()
  EP_E_ID: string;

  @Column()
  EP_PropertyName: string;

  @Column()
  EP_PropertyValue: string;

  @Column() // Explicitly specify 'bit' type for boolean
  EP_ISACTIVE: boolean;

  @Column()
  EP_ADDUSER: number;

  @Column()
  EP_CREATEDON: Date;

  @Column()
  EP_MODIFIEDUSER: number;

  @Column()
  EP_MODIFIEDON: Date;

  @Column()
  EP_GroupId: number;

  @Column()
  EP_LookUpId: number;

  @Column()
  ProductCode: string;
}
