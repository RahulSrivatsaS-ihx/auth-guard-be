import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('TblUserMap_Role')
export class TblUserMapRoleEntity {
  @PrimaryGeneratedColumn()
  TUMR_Id: number;

  @Column()
  TUMR_TAU_Id: number;

  @Column({ default: true })
  TUMR_IsActive: boolean;

  @Column()
  TUMR_Role: string;

  @Column()
  TUMR_CreatedBy: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // TUMR_CreatedOn: Date;
  @Column({ name: 'TUMR_CreatedOn', type: 'timestamp', nullable: false })
  TUMR_CreatedOn: Date;
  @Column({ nullable: true })
  TUMR_ModifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  TUMR_ModifiedOn: Date;
}
