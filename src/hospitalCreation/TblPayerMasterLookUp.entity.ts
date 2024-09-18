import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ 
  name: 'TblPayerMasterLookUp', 
  schema: 'IHXProvider' // Specify the schema
})
export class TblPayerMasterLookUpEntity {
  @PrimaryGeneratedColumn()
  id: number; // Primary key column

  @Column({ nullable: true })
  PayerId?: number;

  @Column({ nullable: true })
  MasterType?: number;

  @Column({ nullable: true, length: 512 })
  PayerMasterId?: string;

  @Column({ nullable: true, length: 512 })
  PayerMasterValue?: string;

  @Column({ nullable: true, length: 100 })
  MAMasterTableName?: string;

  @Column({ nullable: true })
  MaMasterId?: number;

  @Column({ nullable: true })
  ParentId?: number;

  @Column({ type: 'bit', default: false })
  IsActive?: boolean;

  @Column({ type: 'datetime', nullable: true })
  CreatedOn?: Date;

  @Column({ nullable: true })
  Createdby?: number;

  @Column({ type: 'datetime', nullable: true })
  ModifiedOn?: Date;

  @Column({ nullable: true })
  ModifiedBy?: number;

  @Column({ nullable: true, length: 100 })
  PayerSchemeCode?: string;
}
