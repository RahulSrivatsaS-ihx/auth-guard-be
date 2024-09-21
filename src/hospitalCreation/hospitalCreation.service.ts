import { Injectable, BadRequestException, Logger } from '@nestjs/common'; // Import Logger
import { InjectRepository } from '@nestjs/typeorm';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './CreateHospitalDto';
import { TblPayerMasterLookUpEntity } from './TblPayerMasterLookUp.entity';
import { LookupService } from 'src/getLocationCodes/getLocationCodes.service';
import { TblProfileDetailEntity } from './ProfileDetail.entity';
import { getPayerId } from 'src/utils/constants';
@Injectable()
export class HospitalCreationService {
  // Define a constant for similarity threshold
  private readonly SIMILARITY_THRESHOLD = 90;
  private readonly logger = new Logger(HospitalCreationService.name); // Initialize the logger

  constructor(
    @InjectRepository(EntityTbl_Entity, 'IHXSupremeConnection')
    private readonly entityRepository: Repository<EntityTbl_Entity>,

    @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
    private readonly entityPropertyRepository: Repository<EntityPropertyEntity>,

    @InjectRepository(TblProfileDetailEntity, 'ValhallaConnection')
    private readonly profileDetailRepository: Repository<TblProfileDetailEntity>,

    @InjectRepository(TblPayerMasterLookUpEntity, 'IhxProviderConnection')
    private readonly tblPayerMasterLookUpEntity: Repository<TblPayerMasterLookUpEntity>,

    private readonly lookupService: LookupService, // Inject LookupService

  ) {}
 
  
  async hospitalCreation(data: CreateHospitalDto): Promise<void> {
    // Check if the email already exists
    const emailExists = await this.entityRepository.findOne({
        where: { E_EmailAddress: data.hospitalMailId },
    });

    if (emailExists) {
        throw new BadRequestException(`Hospital with email ${data.hospitalMailId} already exists.`);
    }

    // Check if the Rohini ID already exists
    const rohiniIdExists = await this.entityPropertyRepository.findOne({
        where: { EP_PropertyName: 'TMH_RohiniCode', EP_ISACTIVE: true, EP_PropertyValue: data.rohiniCode }
    });

    if (rohiniIdExists) {
        throw new BadRequestException(`RohiniId with ${data.rohiniCode} already exists.`);
    }

    this.logger.log('Existing mail id:', emailExists);

    const existingHospitals = await this.entityRepository.find();
    const existingRohiniCodes = await this.entityPropertyRepository.find({
        where: { EP_PropertyName: 'TMH_RohiniCode', EP_ISACTIVE: true }
    });

    let similarHospitals: any = [];

    // Calculate similarity and check for matching Rohini codes
    for (const hospital of existingHospitals) {
        const hospitalNameSimilarity = this.calculateSimilarity(hospital.E_FullName, data.hospitalName);
        const addressSimilarity = this.calculateSimilarity(hospital.E_PrimaryAddress, data.address);
        const pinCodeSimilarity = this.calculateSimilarity(hospital.E_PinCode, data.pinCode);
        const emailSimilarity = this.calculateSimilarity(hospital.E_EmailAddress, data.hospitalMailId);

        const matchedRohiniCode = existingRohiniCodes.find(
            rohini => Number(rohini.EP_E_ID) === hospital.E_Id
        );

        const rohiniCode = matchedRohiniCode ? matchedRohiniCode.EP_PropertyValue : null;
        const rohiniCodeSimilarity = this.calculateSimilarity(rohiniCode, data.rohiniCode);

        if (
            hospitalNameSimilarity > this.SIMILARITY_THRESHOLD || 
            addressSimilarity > this.SIMILARITY_THRESHOLD || 
            pinCodeSimilarity > this.SIMILARITY_THRESHOLD ||
            rohiniCodeSimilarity > this.SIMILARITY_THRESHOLD
        ) {
            similarHospitals.push({
                referenceId: hospital.E_Id,
                hospitalName: hospital.E_FullName,
                address: hospital.E_PrimaryAddress,
                pinCode: hospital.E_PinCode,
                email: hospital.E_EmailAddress,
                rohiniCode,
                hospitalNameSimilarity,
                addressSimilarity,
                pinCodeSimilarity,
                emailSimilarity,
                rohiniCodeSimilarity
            });
        }
    }

    this.logger.log('Similar hospitals:', similarHospitals);

    const cityCode = await this.lookupService.findLocationByValue('state', data.cityName);
    const stateCode = await this.lookupService.findLocationByValue('state', data.stateName);

    if (similarHospitals.length > 0) {
        throw new BadRequestException({
            message: 'Similar hospitals found with the following similarity percentages:',
            similarHospitals,
        });
    }

    const newHospital = this.entityRepository.create({
        E_EntityType: '4',
        E_DisplayName: data.hospitalName,
        E_ISACTIVE: true,
        E_CREATEDON: new Date(),
        E_MODIFIEDON: new Date(),
        E_MODIFIEDUSER: '1',
        E_FullName: data.hospitalName,
        E_PrimaryAddress: data.address,
        E_PinCode: data.pinCode,
        E_EmailAddress: data.hospitalMailId,
        E_CountryId: '46',
        E_CityId: String(cityCode[0]?.MLU_ID || 'null'),
        E_StateId: String(stateCode[0]?.MLU_ID || 'null'),
    });

    try {
        // Save the new hospital and generate E_Id
        const savedHospital = await this.entityRepository.save(newHospital);
        const newHospitalEntityId = String(savedHospital.E_Id); // This is the new E_Id

        // Now create multiple default rows for the new hospital
        const entityProperties = [
            { EP_PropertyName: 'TMH_RohiniCode', EP_PropertyValue: data.rohiniCode },
            { EP_PropertyName: 'IsMAIntegrationEnabled', EP_PropertyValue: 'true' },
            { EP_PropertyName: 'IsManualRedirectionToIHX', EP_PropertyValue: 'true' },
            { EP_PropertyName: 'IsForcedRedirectionToIHX', EP_PropertyValue: 'true' },
            { EP_PropertyName: 'IsNewAutomationEnabled', EP_PropertyValue: 'true' },
            { EP_PropertyName: 'IsNewMailboxConfigEnabled', EP_PropertyValue: 'true' },
            { EP_PropertyName: 'DefaultConfiguredPayerId', EP_PropertyValue: '516572' },
            { EP_PropertyName: 'ConfiguredPayer', EP_PropertyValue: '523844' },
        ];

        for (const property of entityProperties) {
            const newHospitalEntityProperty = this.entityPropertyRepository.create({
                EP_E_ID: newHospitalEntityId, // Link to the created hospital's E_Id
                EP_PropertyName: property.EP_PropertyName,
                EP_PropertyValue: property.EP_PropertyValue,
                EP_ISACTIVE: true,
                EP_CREATEDON: new Date(),
                EP_MODIFIEDON: new Date(),
                EP_MODIFIEDUSER: 1,
            });

            // Save each entity property
            await this.entityPropertyRepository.save(newHospitalEntityProperty);
        }

        // Create Payer Master LookUp entry

        const newHospitalPayerMasterLookUp = this.tblPayerMasterLookUpEntity.create({
            MasterType: 9,
            PayerMasterId: data.payerHospitalId,
            PayerId: String(getPayerId(data.payerHospitalId)),
            PayerMasterValue: data.hospitalName,
            MAMasterTableName: 'pmr.entity',
            MaMasterId: newHospitalEntityId,
            IsActive: true,
            CreatedOn: new Date(),
            ModifiedOn: new Date(),
            Createdby: 1,
        });


        // Create Profile Detail entry
        const newHospitalProfileDetail = this.profileDetailRepository.create({
            PD_IsActive: true,
            PD_CityId: String(cityCode[0]?.MLU_ID || 'null'),
            PD_StateId: String(stateCode[0]?.MLU_ID || 'null'),
            PD_DisplayName: data.hospitalName,
            PD_FullName: data.hospitalName,
            PD_SupremeId: newHospitalEntityId,
            PD_RohiniId: data.rohiniCode,
            PD_StreetAddress: data.address,
            PD_Pincode: data.pinCode,
            PD_Email: data.hospitalMailId,
            PD_IsApproved: true,
            PD_ApprovedOn: new Date(),
            PD_CreatedOn: new Date(),
            PD_ModifiedOn: new Date(),
        });

        // Save the profile and Payer Master LookUp
        await this.tblPayerMasterLookUpEntity.save(newHospitalPayerMasterLookUp);
        await this.profileDetailRepository.save(newHospitalProfileDetail);

        this.logger.log('Hospital and properties created successfully');
    } catch (error) {
        this.logger.error('Error while creating hospital or properties:', error.message);

        // Handle identity value errors specifically
        if (error.message.includes('DEFAULT or NULL are not allowed as explicit identity values')) {
            throw new BadRequestException('Identity column error: Ensure you are not providing explicit null or default values for identity fields.');
        } else {
            throw new BadRequestException('Failed to create hospital or properties.');
        }
    }
}

  
  calculateSimilarity(value1: string, value2: string): number {
    if (!value1 || !value2) return 0;

    const value1Lower = value1.toLowerCase();
    const value2Lower = value2.toLowerCase();

    let matches = 0;
    const length = Math.max(value1Lower.length, value2Lower.length);

    for (let i = 0; i < length; i++) {
      if (value1Lower[i] === value2Lower[i]) {
        matches++;
      }
    }

    return (matches / length) * 100;
  }
}
