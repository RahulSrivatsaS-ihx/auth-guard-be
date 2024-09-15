import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('TblApplicationUser')
export class TblApplicationUserEntity {
  @PrimaryGeneratedColumn({ name: 'TAU_Id' })
  TAU_Id: number;

  @Column({ name: 'TAU_MBId', type: 'int', nullable: true })
  TAU_MBId?: number;

  @Column({ name: 'TAU_FirstName', type: 'varchar', length: 255, nullable: true })
  TAU_FirstName?: string;

  @Column({ name: 'TAU_LastName', type: 'varchar', length: 255, nullable: true })
  TAU_LastName?: string;

  @Column({ name: 'TAU_MiddleName', type: 'varchar', length: 255, nullable: true })
  TAU_MiddleName?: string;

  @Column({ name: 'TAU_LoginName', type: 'varchar', length: 255, unique: true })
  TAU_LoginName: string;

  @Column({ name: 'TAU_Password', type: 'varchar', length: 255, nullable: true })
  TAU_Password?: string;

  @Column({ name: 'TAU_ProviderMasterEntityId', type: 'int', nullable: true })
  TAU_ProviderMasterEntityId?: number;

  @Column({ name: 'TAU_EmailId', type: 'varchar', length: 255, nullable: true })
  TAU_EmailId?: string;

  @Column({ name: 'TAU_AltEmailId', type: 'varchar', length: 255, nullable: true })
  TAU_AltEmailId?: string;

  @Column({ name: 'TAU_PhoneNumber', type: 'varchar', length: 15, nullable: true })
  TAU_PhoneNumber?: string;

  @Column({ name: 'TAU_AltPhoneNumber', type: 'varchar', length: 15, nullable: true })
  TAU_AltPhoneNumber?: string;

  @Column({ name: 'TAU_IsActive', type: 'boolean' })
  TAU_IsActive: boolean;

  @Column({ name: 'TAU_IsLocked', type: 'boolean' })
  TAU_IsLocked: boolean;

  @Column({ name: 'TAU_FailedAttemptCount', type: 'int', nullable: true })
  TAU_FailedAttemptCount?: number;

  @Column({ name: 'TAU_Createdby', type: 'varchar', length: 255, nullable: true })
  TAU_Createdby?: string;

  @CreateDateColumn({ name: 'TAU_CreatedOn', type: 'datetime' })
  TAU_CreatedOn: Date;

  @Column({ name: 'TAU_Password1', type: 'varchar', length: 255, nullable: true })
  TAU_Password1?: string;

  @UpdateDateColumn({ name: 'Modifiedon', type: 'datetime', nullable: true })
  Modifiedon?: Date;

  @Column({ name: 'TAU_HasLoggedIn', type: 'boolean', nullable: true })
  TAU_HasLoggedIn?: boolean;

  @Column({ name: 'TAU_AccountLockedOn', type: 'datetime', nullable: true })
  TAU_AccountLockedOn?: Date;

  @Column({ name: 'TAU_ModifiedBy', type: 'varchar', length: 255, nullable: true })
  TAU_ModifiedBy?: string;

  @Column({ name: 'TAU_IsMobileVerified', type: 'boolean', nullable: true })
  TAU_IsMobileVerified?: boolean;

  @Column({ name: 'TAU_IsEmailVerified', type: 'boolean', nullable: true })
  TAU_IsEmailVerified?: boolean;

  @Column({ name: 'TAU_MobileVerifiedModifiedOn', type: 'datetime', nullable: true })
  TAU_MobileVerifiedModifiedOn?: Date;

  @Column({ name: 'TAU_EmailVerifiedModifiedOn', type: 'datetime', nullable: true })
  TAU_EmailVerifiedModifiedOn?: Date;
}