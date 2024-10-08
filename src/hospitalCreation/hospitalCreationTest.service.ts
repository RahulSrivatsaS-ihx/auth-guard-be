// import { Injectable, BadRequestException, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { EntityTbl_Entity } from 'src/info/entity.entity';
// import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
// import { Repository } from 'typeorm';
// import { CreateHospitalDto } from './CreateHospitalDto';
// import { TblPayerMasterLookUpEntity } from './TblPayerMasterLookUp.entity';
// import { LookupService } from 'src/getLocationCodes/getLocationCodes.service';
// import { TblProfileDetailEntity } from './ProfileDetail.entity';
// import { getPayerId } from 'src/utils/constants';
// import { calculateSimilarity } from 'src/utils/utils';

// @Injectable()
// export class HospitalCreationService {
//   private readonly SIMILARITY_THRESHOLD = 90;
//   private readonly logger = new Logger(HospitalCreationService.name);

//   constructor(
//     @InjectRepository(EntityTbl_Entity, 'IHXSupremeConnection')
//     private readonly entityRepository: Repository<EntityTbl_Entity>,

//     @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
//     private readonly entityPropertyRepository: Repository<EntityPropertyEntity>,

//     @InjectRepository(TblProfileDetailEntity, 'ValhallaConnection')
//     private readonly profileDetailRepository: Repository<TblProfileDetailEntity>,

//     @InjectRepository(TblPayerMasterLookUpEntity, 'IhxProviderConnection')
//     private readonly tblPayerMasterLookUpEntity: Repository<TblPayerMasterLookUpEntity>,

//     private readonly lookupService: LookupService,
//   ) {}

//   async hospitalCreation(data: CreateHospitalDto): Promise<void> {
//     try {
//       await this.checkExistingRecords(data.hospitalMailId, data.rohiniCode);

//       const existingHospitals = await this.entityRepository.find();
//       const existingRohiniCodes = await this.entityPropertyRepository.find({
//         where: { EP_PropertyName: 'TMH_RohiniCode', EP_ISACTIVE: true },
//       });

//       const similarHospitals = this.findSimilarHospitals(
//         existingHospitals,
//         existingRohiniCodes,
//         data,
//       );
//       console.log('Similar Hospitals:', similarHospitals);
//       if (similarHospitals.length > 0) {
//         throw new BadRequestException({
//           message:
//             'Similar hospitals found with the following similarity percentages:',
//             similarHospitalsDetails:similarHospitals || [],
//         });
//       }

//       const [cityCode, stateCode] = await Promise.all([
//         this.lookupService.findLocationByValue('state', data.cityName),
//         this.lookupService.findLocationByValue('state', data.stateName),
//       ]);

//       const newHospital = await this.createHospital(data, cityCode, stateCode);
//       await this.createEntityProperties(newHospital.E_Id, data.rohiniCode);
//       await this.createPayerMasterLookUp(newHospital.E_Id, data);
//       await this.createProfileDetail(
//         newHospital.E_Id,
//         data,
//         cityCode,
//         stateCode,
//       );

//       this.logger.log('Hospital and properties created successfully');
//     } catch (error) {
//       this.logger.error('Error during hospital creation:', error);
//       throw new BadRequestException(
//         'Failed to create hospital: ' + error.message,
//       );
//     }
//   }

//   private async checkExistingRecords(
//     email: string,
//     rohiniCode: string,
//   ): Promise<void> {
//     try {
//       const emailExists = await this.entityRepository.findOne({
//         where: { E_EmailAddress: email },
//       });
//       if (emailExists) {
//         throw new BadRequestException(
//           `Hospital with email ${email} already exists.`,
//         );
//       }

//       const rohiniIdExists = await this.entityPropertyRepository.findOne({
//         where: {
//           EP_PropertyName: 'TMH_RohiniCode',
//           EP_ISACTIVE: true,
//           EP_PropertyValue: rohiniCode,
//         },
//       });
//       if (rohiniIdExists) {
//         throw new BadRequestException(
//           `RohiniId with ${rohiniCode} already exists.`,
//         );
//       }
//     } catch (error) {
//       this.logger.error('Error checking existing records:', error);
//       throw new BadRequestException(
//         'Error checking existing records: ' + error.message,
//       );
//     }
//   }

//   private findSimilarHospitals(
//     existingHospitals: EntityTbl_Entity[],
//     existingRohiniCodes: EntityPropertyEntity[],
//     data: CreateHospitalDto,
//   ) {
//     return existingHospitals.reduce((acc, hospital) => {
//       const hospitalNameSimilarity = calculateSimilarity(
//         hospital.E_FullName,
//         data.hospitalName,
//       );
//       const addressSimilarity = calculateSimilarity(
//         hospital.E_PrimaryAddress,
//         data.address,
//       );
//       const pinCodeSimilarity = calculateSimilarity(
//         hospital.E_PinCode,
//         data.pinCode,
//       );
//       const emailSimilarity = calculateSimilarity(
//         hospital.E_EmailAddress,
//         data.hospitalMailId,
//       );

//       const matchedRohiniCode = existingRohiniCodes.find(
//         (rohini) => Number(rohini.EP_E_ID) === hospital.E_Id,
//       );
//       const rohiniCodeSimilarity = matchedRohiniCode
//         ? calculateSimilarity(
//             matchedRohiniCode.EP_PropertyValue,
//             data.rohiniCode,
//           )
//         : 0;

//       if (
//         hospitalNameSimilarity > this.SIMILARITY_THRESHOLD ||
//         addressSimilarity > this.SIMILARITY_THRESHOLD ||
//         pinCodeSimilarity > this.SIMILARITY_THRESHOLD ||
//         rohiniCodeSimilarity > this.SIMILARITY_THRESHOLD
//       ) {
//         acc.push({
//           referenceId: hospital.E_Id,
//           hospitalName: hospital.E_FullName,
//           address: hospital.E_PrimaryAddress,
//           pinCode: hospital.E_PinCode,
//           email: hospital.E_EmailAddress,
//           rohiniCode: matchedRohiniCode
//             ? matchedRohiniCode.EP_PropertyValue
//             : null,
//           hospitalNameSimilarity,
//           addressSimilarity,
//           pinCodeSimilarity,
//           emailSimilarity,
//           rohiniCodeSimilarity,
//         });
//       }
//       return acc;
//     }, []);
//   }

//   private async createHospital(
//     data: CreateHospitalDto,
//     cityCode: any,
//     stateCode: any,
//   ): Promise<EntityTbl_Entity> {
//     try {
//       const newHospital = this.entityRepository.create({
//         E_EntityType: '4',
//         E_DisplayName: data.hospitalName,
//         E_ISACTIVE: true,
//         E_CREATEDON: new Date(),
//         E_MODIFIEDON: new Date(),
//         E_MODIFIEDUSER: '1',
//         E_FullName: data.hospitalName,
//         E_PrimaryAddress: data.address,
//         E_PinCode: data.pinCode,
//         E_EmailAddress: data.hospitalMailId,
//         E_CountryId: '46',
//         E_CityId: String(cityCode[0]?.MLU_ID || 'null'),
//         E_StateId: String(stateCode[0]?.MLU_ID || 'null'),
//       });
//       return await this.entityRepository.save(newHospital);
//     } catch (error) {
//       this.logger.error('Error creating hospital:', error);
//       throw new BadRequestException(
//         'Error creating hospital: ' + error.message,
//       );
//     }
//   }

//   private async createEntityProperties(
//     hospitalId: number,
//     rohiniCode: string,
//   ): Promise<void> {
//     try {
//       const entityProperties = [
//         { EP_PropertyName: 'TMH_RohiniCode', EP_PropertyValue: rohiniCode },
//         { EP_PropertyName: 'IsMAIntegrationEnabled', EP_PropertyValue: 'true' },
//         {
//           EP_PropertyName: 'IsManualRedirectionToIHX',
//           EP_PropertyValue: 'true',
//         },
//         {
//           EP_PropertyName: 'IsForcedRedirectionToIHX',
//           EP_PropertyValue: 'true',
//         },
//         { EP_PropertyName: 'IsNewAutomationEnabled', EP_PropertyValue: 'true' },
//         {
//           EP_PropertyName: 'IsNewMailboxConfigEnabled',
//           EP_PropertyValue: 'true',
//         },
//         {
//           EP_PropertyName: 'DefaultConfiguredPayerId',
//           EP_PropertyValue: '516572',
//         },
//         { EP_PropertyName: 'ConfiguredPayer', EP_PropertyValue: '523844' },
//       ];

//       const propertyPromises = entityProperties.map((property) => {
//         const newHospitalEntityProperty = this.entityPropertyRepository.create({
//           EP_E_ID: String(hospitalId),
//           EP_PropertyName: property.EP_PropertyName,
//           EP_PropertyValue: property.EP_PropertyValue,
//           EP_ISACTIVE: true,
//           EP_CREATEDON: new Date(),
//           EP_MODIFIEDON: new Date(),
//           EP_MODIFIEDUSER: 1,
//         });
//         return this.entityPropertyRepository.save(newHospitalEntityProperty);
//       });

//       await Promise.all(propertyPromises);
//     } catch (error) {
//       this.logger.error('Error creating entity properties:', error);
//       throw new BadRequestException(
//         'Error creating entity properties: ' + error.message,
//       );
//     }
//   }

//   private async createPayerMasterLookUp(
//     hospitalId: number,
//     data: CreateHospitalDto,
//   ): Promise<void> {
//     try {
//       const newHospitalPayerMasterLookUp =
//         this.tblPayerMasterLookUpEntity.create({
//           MasterType: 9,
//           PayerMasterId: data.payerHospitalId,
//           PayerId: String(getPayerId(data.payerHospitalId)),
//           PayerMasterValue: data.hospitalName,
//           MAMasterTableName: 'pmr.entity',
//           MaMasterId: String(hospitalId),
//           IsActive: true,
//           CreatedOn: new Date(),
//           ModifiedOn: new Date(),
//           Createdby: 1,
//         });
//       await this.tblPayerMasterLookUpEntity.save(newHospitalPayerMasterLookUp);
//     } catch (error) {
//       this.logger.error('Error creating Payer Master LookUp:', error);
//       throw new BadRequestException(
//         'Error creating Payer Master LookUp: ' + error.message,
//       );
//     }
//   }

//   private async createProfileDetail(
//     hospitalId: number,
//     data: CreateHospitalDto,
//     cityCode: any,
//     stateCode: any,
//   ): Promise<void> {
//     try {
//       const newHospitalProfileDetail = this.profileDetailRepository.create({
//         PD_IsActive: true,
//         PD_CityId: String(cityCode[0]?.MLU_ID || 'null'),
//         PD_StateId: String(stateCode[0]?.MLU_ID || 'null'),
//         PD_DisplayName: data.hospitalName,
//         PD_FullName: data.hospitalName,
//         PD_SupremeId: String(hospitalId),
//         PD_RohiniId: data.rohiniCode,
//         PD_StreetAddress: data.address,
//         PD_Pincode: data.pinCode,
//         PD_Email: data.hospitalMailId,
//         PD_IsApproved: true,
//         PD_ApprovedOn: new Date(),
//         PD_CreatedOn: new Date(),
//         PD_ModifiedOn: new Date(),
//       });
//       await this.profileDetailRepository.save(newHospitalProfileDetail);
//     } catch (error) {
//       this.logger.error('Error creating Profile Detail:', error);
//       throw new BadRequestException(
//         'Error creating Profile Detail: ' + error.message,
//       );
//     }
//   }
// }
