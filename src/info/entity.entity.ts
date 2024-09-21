import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ENTITY' }) // Match table name
export class EntityTbl_Entity {

  @PrimaryGeneratedColumn()
  E_Id: number;

  @Column({ name: 'E_ParentId', nullable: true })
  E_ParentId: number;

  @Column({ name: 'E_EntityType', nullable: true })
  E_EntityType: string;

  @Column({ name: 'E_Hierarchy_Group', nullable: true })
  E_Hierarchy_Group: string;

  @Column({ name: 'E_Hierarchy_Sub_Group', nullable: true })
  E_Hierarchy_Sub_Group: string;

  @Column({ name: 'E_FullName', nullable: true })
  E_FullName: string;

  @Column({ name: 'E_DisplayName', nullable: true })
  E_DisplayName: string;

  @Column({ name: 'E_PrimaryAddress', nullable: true })
  E_PrimaryAddress: string;

  @Column({ name: 'E_Landmark', nullable: true })
  E_Landmark: string;

  @Column({ name: 'E_PinCode', nullable: true })
  E_PinCode: string;

  @Column({ name: 'E_CountryId', nullable: true })
  E_CountryId: string;

  @Column({ name: 'E_StateId', nullable: true })
  E_StateId: string;

  @Column({ name: 'E_CityId', nullable: true })
  E_CityId: string;

  @Column({ name: 'E_DistrictId', nullable: true })
  E_DistrictId: string;

  @Column({ name: 'E_LocationId', nullable: true })
  E_LocationId: string;

  @Column({ name: 'E_LandlineNumber', nullable: true })
  E_LandlineNumber: string;

  @Column({ name: 'E_FaxNumber', nullable: true })
  E_FaxNumber: string;

  @Column({ name: 'E_MobileNumber', nullable: true })
  E_MobileNumber: string;

  @Column({ name: 'E_EmailAddress', nullable: true })
  E_EmailAddress: string;

  @Column({ name: 'E_ContactName', nullable: true })
  E_ContactName: string;

  @Column({ name: 'E_ContactNumber', nullable: true })
  E_ContactNumber: string;

  @Column({ name: 'E_ContactEmail', nullable: true })
  E_ContactEmail: string;

  @Column({ name: 'E_TollFreeNo', nullable: true })
  E_TollFreeNo: string;

  @Column({ name: 'E_Website', nullable: true })
  E_Website: string;

  @Column({ name: 'E_Latitude', nullable: true })
  E_Latitude: number;

  @Column({ name: 'E_Longitude', nullable: true })
  E_Longitude: number;

  @Column({ name: 'E_LatLongVerified', nullable: true })
  E_LatLongVerified: boolean;

  @Column({ name: 'E_GSTINNumber', nullable: true })
  E_GSTINNumber: string;

  @Column({ name: 'E_PanNumber', nullable: true })
  E_PanNumber: string;

  @Column({ name: 'E_PanHolderName', nullable: true })
  E_PanHolderName: string;

  @Column({ name: 'E_PanStatus', nullable: true })
  E_PanStatus: string;

  @Column({ name: 'E_PanRemarks', nullable: true })
  E_PanRemarks: string;

  @Column({ name: 'E_Rating', nullable: true })
  E_Rating: number;

  @Column({ name: 'E_ISACTIVE', nullable: true })
  E_ISACTIVE: boolean;

  @Column({ name: 'E_ADDUSER', nullable: true })
  E_ADDUSER: string;

  @Column({ name: 'E_CREATEDON', type: 'datetime', nullable: true })
  E_CREATEDON: Date;

  @Column({ name: 'E_MODIFIEDUSER', nullable: true })
  E_MODIFIEDUSER: string;

  @Column({ name: 'E_MODIFIEDON', type: 'datetime', nullable: true })
  E_MODIFIEDON: Date;

  @Column({ name: 'E_PrevEntityId', nullable: true })
  E_PrevEntityId: number;
}
