import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { CreateHospitalDto } from './CreateHospitalDto';
import { TblProfileDetailEntity } from './ProfileDetailEntity';

@Injectable()
export class HospitalCreationService {
  private readonly logger = new Logger(HospitalCreationService.name);

  constructor(
    @InjectRepository(EntityTbl_Entity, 'IHXSupremeConnection')
    private readonly entityRepository: Repository<EntityTbl_Entity>,

    @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
    private readonly entityPropertyRepository: Repository<EntityPropertyEntity>,

    @InjectRepository(TblProfileDetailEntity, 'hospProfileConnection')
    private readonly tblProfileDetailEntity: Repository<TblProfileDetailEntity>,
  ) {}

  async hospitalCreation(data: CreateHospitalDto): Promise<void> {
    // Check for duplicates in ProfileDetailEntity
    // const duplicateEntity = await this.profileDetailRepository.findOne({
    //   where: [
    //     { PD_RohiniId: data.rohiniCode },
    //     { PD_Email: data.hospitalMailId }
    //   ],
    // });

    // if (duplicateEntity) {
    //   throw new BadRequestException('Hospital with given Rohini ID or email already exists');
    // }

    // // Check for duplicates in EntityPropertyEntity (for username)
    // const duplicateUsername = await this.entityPropertyRepository.findOne({
    //   where: { EP_PropertyValue: data.userName },
    // });

    // if (duplicateUsername) {
    //   throw new BadRequestException('Username already exists');
    // }

    // // Insert into EntityTbl_Entity
    // const newEntity = this.entityRepository.create({
    //   E_FullName: data.hospitalName,
    //   E_PrimaryAddress: data.address,
    //   E_CityId: data.cityName,
    //   E_StateId: data.stateName,
    //   E_PinCode: data.pinCode,
    //   E_EmailAddress: data.hospitalMailId,
    //   E_ContactName: `${data.firstName} ${data.lastName}`,
    //   E_MobileNumber: data.phoneNumber,
    //   E_RohiniCode: data.rohiniCode,
    //   E_TollFreeNo: data.payerHospitalId || '',
    //   E_ISACTIVE: true,
    //   E_CREATEDON: new Date(),
    //   E_ADDUSER: data.userName,
    // });

    // const savedEntity = await this.entityRepository.save(newEntity);
    // const savedEntityId = z.E_Id;

    // // Insert into EntityPropertyEntity
    // const newEntityProperty = this.entityPropertyRepository.create({
    //   EP_E_ID: savedEntityId.toString(),
    //   EP_PropertyName: 'Username',
    //   EP_PropertyValue: data.userName,
    //   EP_ISACTIVE: true,
    //   EP_ADDUSER: data.userName,
    //   EP_CREATEDON: new Date(),
    //   EP_MODIFIEDUSER: data.userName,
    //   EP_MODIFIEDON: new Date(),
    //   EP_GroupId: 1, // Example group ID, adjust as needed
    //   EP_LookUpId: 1, // Example lookup ID, adjust as needed
    //   ProductCode: 'HOSP123', // Example product code, adjust as needed
    // });

    // await this.entityPropertyRepository.save(newEntityProperty);

    // // Insert into ProfileDetailEntity
    // const newProfileDetail = this.profileDetailRepository.create({
    //   PD_FullName: `${data.firstName} ${data.lastName}`,
    //   PD_Email: data.hospitalMailId,
    //   PD_RohiniId: data.rohiniCode,
    //   PD_StreetAddress: data.address,
    //   PD_Pincode: data.pinCode,
    //   PD_CityId: data.cityName, // Adjust if necessary
    //   PD_StateId: data.stateName, // Adjust if necessary
    //   PD_Latitude: null, // Set accordingly
    //   PD_Longitude: null, // Set accordingly
    //   PD_IsActive: true,
    //   PD_CreatedOn: new Date(),
    //   PD_CreatedBy: data.userName,
    // });

    // await this.profileDetailRepository.save(newProfileDetail);
  }
}
