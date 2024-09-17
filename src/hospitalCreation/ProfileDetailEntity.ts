import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblProfileDetail', schema: 'hospProfile' })
export class ProfileDetailEntity {
  @PrimaryGeneratedColumn({ name: 'PD_Id' })
  PD_Id: number;

  @Column({ name: 'PD_FullName', type: 'varchar', length: 255 })
  PD_FullName: string;

  @Column({ name: 'PD_DisplayName', type: 'varchar', length: 255, nullable: true })
  PD_DisplayName: string;

  @Column({ name: 'PD_SupremeId', type: 'int', nullable: true })
  PD_SupremeId: number;

  @Column({ name: 'PD_GroupId', type: 'int', nullable: true })
  PD_GroupId: number;

  @Column({ name: 'PD_GroupName', type: 'varchar', length: 255, nullable: true })
  PD_GroupName: string;

  @Column({ name: 'PD_RohiniId', type: 'varchar', length: 255, nullable: true })
  PD_RohiniId: string;

  @Column({ name: 'PD_StreetAddress', type: 'varchar', length: 500, nullable: true })
  PD_StreetAddress: string;

  @Column({ name: 'PD_Landmark', type: 'varchar', length: 255, nullable: true })
  PD_Landmark: string;

  @Column({ name: 'PD_Pincode', type: 'varchar', length: 20, nullable: true })
  PD_Pincode: string;

  @Column({ name: 'PD_StateId', type: 'int', nullable: true })
  PD_StateId: number;

  @Column({ name: 'PD_CityId', type: 'int', nullable: true })
  PD_CityId: number;

  @Column({ name: 'PD_LocationId', type: 'int', nullable: true })
  PD_LocationId: number;

  @Column({ name: 'PD_Latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  PD_Latitude: number;

  @Column({ name: 'PD_Longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  PD_Longitude: number;

  @Column({ name: 'PD_Description', type: 'text', nullable: true })
  PD_Description: string;

  @Column({ name: 'PD_PANCardNumber', type: 'varchar', length: 50, nullable: true })
  PD_PANCardNumber: string;

  @Column({ name: 'PD_PANCardHolderName', type: 'varchar', length: 255, nullable: true })
  PD_PANCardHolderName: string;

  @Column({ name: 'PD_FaxNumber', type: 'varchar', length: 50, nullable: true })
  PD_FaxNumber: string;

  @Column({ name: 'PD_Email', type: 'varchar', length: 255, nullable: true })
  PD_Email: string;

  @Column({ name: 'PD_TollfreeNumber', type: 'varchar', length: 50, nullable: true })
  PD_TollfreeNumber: string;

  @Column({ name: 'PD_LandlineNumber', type: 'varchar', length: 50, nullable: true })
  PD_LandlineNumber: string;

  @Column({ name: 'PD_GSTNumber', type: 'varchar', length: 50, nullable: true })
  PD_GSTNumber: string;

  @Column({ name: 'PD_Website', type: 'varchar', length: 255, nullable: true })
  PD_Website: string;

  @Column({ name: 'PD_Grade', type: 'varchar', length: 50, nullable: true })
  PD_Grade: string;

  @Column({ name: 'PD_UserRating', type: 'decimal', precision: 5, scale: 2, nullable: true })
  PD_UserRating: number;

  @Column({ name: 'PD_IHXRating', type: 'decimal', precision: 5, scale: 2, nullable: true })
  PD_IHXRating: number;

  @Column({ name: 'PD_StatusId', type: 'int', nullable: true })
  PD_StatusId: number;

  @Column({ name: 'PD_IsApproved', type: 'bit', default: 0 })
  PD_IsApproved: boolean;

  @Column({ name: 'PD_ApprovedBy', type: 'varchar', length: 255, nullable: true })
  PD_ApprovedBy: string;

  @Column({ name: 'PD_ApprovedOn', type: 'datetime', nullable: true })
  PD_ApprovedOn: Date;

  @Column({ name: 'PD_ApprovalRemarks', type: 'text', nullable: true })
  PD_ApprovalRemarks: string;

  @Column({ name: 'PD_IsActive', type: 'bit', default: 1 })
  PD_IsActive: boolean;

  @Column({ name: 'PD_CreatedOn', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  PD_CreatedOn: Date;

  @Column({ name: 'PD_CreatedBy', type: 'varchar', length: 255, nullable: true })
  PD_CreatedBy: string;

  @Column({ name: 'PD_ModifiedOn', type: 'datetime', nullable: true })
  PD_ModifiedOn: Date;

  @Column({ name: 'PD_ModifiedBy', type: 'varchar', length: 255, nullable: true })
  PD_ModifiedBy: string;

  @Column({ name: 'PD_HFRID', type: 'varchar', length: 50, nullable: true })
  PD_HFRID: string;
}
