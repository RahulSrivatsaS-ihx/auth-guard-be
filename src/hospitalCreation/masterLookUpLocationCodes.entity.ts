import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('MASTER_LOOK_UP') // Change 'tbl_lookup' to your actual table name if different
  export class TblLookupEntity {
    @PrimaryGeneratedColumn()
    MLU_ID: number;
  
    @Column({ name: 'MLU_LOOK_UP_COLUMN_NAME', type: 'varchar', length: 255 })
    MLU_LOOK_UP_COLUMN_NAME: string;
  
    @Column({ name: 'MLU_LOOK_UP_COLUMN_VALUE', type: 'varchar', length: 255 })
    MLU_LOOK_UP_COLUMN_VALUE: string;
  
    @Column({ name: 'MLU_PARENT_LOOK_UP_KEY', nullable: true })
    MLU_PARENT_LOOK_UP_KEY: number | null;
  
    @Column({ name: 'MLU_SORT_ORDER', type: 'int' })
    MLU_SORT_ORDER: number;
  
    @Column({ name: 'MLU_ISACTIVE', type: 'int' })
    MLU_ISACTIVE: number;
  
    @Column({ name: 'MLU_ADDUSER', type: 'int' })
    MLU_ADDUSER: number;
  
    @CreateDateColumn({ name: 'MLU_CREATEDON', type: 'timestamp' })
    MLU_CREATEDON: Date;
  
    @Column({ name: 'MLU_MODIFIEDUSER', type: 'int' })
    MLU_MODIFIEDUSER: number;
  
    @UpdateDateColumn({ name: 'MLU_MODIFIEDON', type: 'timestamp' })
    MLU_MODIFIEDON: Date;
  }
  