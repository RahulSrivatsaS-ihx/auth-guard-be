import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TblApplicationUser')
export class TblApplicationUserEntity {
  @PrimaryGeneratedColumn()
  TAU_Id: number;

  @Column({ nullable: true })
  TAU_MBId?: number;

  @Column({ nullable: true, length: 255 })
  TAU_FirstName?: string;

  @Column({ nullable: true, length: 255 })
  TAU_LastName?: string;

  @Column({ nullable: true, length: 255 })
  TAU_MiddleName?: string;

  @Column({ length: 255 })
  TAU_LoginName: string;

  @Column({ nullable: true, length: 255 })
  TAU_Password?: string;

  @Column({ nullable: true })
  TAU_ProviderMasterEntityId?: string;

  @Column({ nullable: true, length: 100 })
  TAU_EmailId?: string;

  @Column({ nullable: true, length: 100 })
  TAU_AltEmailId?: string;

  @Column({ nullable: true, length: 15 })
  TAU_PhoneNumber?: string;

  @Column({ nullable: true, length: 15 })
  TAU_AltPhoneNumber?: string;

  @Column({ type: 'boolean', default: false })
  TAU_IsActive: boolean;

  @Column({ type: 'boolean', default: false })
  TAU_IsLocked: boolean;

  @Column({ nullable: true, default: 0 })
  TAU_FailedAttemptCount?: number;

  @Column({ nullable: true, length: 100 })
  TAU_Createdby?: string;

  @Column({ type: 'datetime', nullable: true })
  TAU_CreatedOn?: Date;

  @Column({ nullable: true, length: 255 })
  TAU_Password1?: string;

  @Column({ type: 'datetime', nullable: true })
  Modifiedon?: Date;

  @Column({ type: 'boolean', default: false })
  TAU_HasLoggedIn: boolean;

  @Column({ type: 'datetime', nullable: true })
  TAU_AccountLockedOn?: Date;

  @Column({ nullable: true, length: 100 })
  TAU_ModifiedBy?: string;

  @Column({ type: 'boolean', default: false })
  TAU_IsMobileVerified: boolean;

  @Column({ type: 'boolean', default: false })
  TAU_IsEmailVerified: boolean;

  @Column({ type: 'datetime', nullable: true })
  TAU_MobileVerifiedModifiedOn?: Date;

  @Column({ type: 'datetime', nullable: true })
  TAU_EmailVerifiedModifiedOn?: Date;
}
