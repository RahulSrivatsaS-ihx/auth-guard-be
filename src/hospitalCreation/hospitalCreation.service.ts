import { Injectable, BadRequestException, Logger } from '@nestjs/common'; // Import Logger
import { InjectRepository } from '@nestjs/typeorm';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './CreateHospitalDto';
import { TblProfileDetailEntity } from './ProfileDetailEntity';
import { TblPayerMasterLookUpEntity } from './TblPayerMasterLookUp.entity';
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
    private readonly tblPayerMasterLookUpEntityL: Repository<TblPayerMasterLookUpEntity>,
  ) {}

  async hospitalCreation(data: CreateHospitalDto): Promise<void> {
    const emailExists = await this.entityRepository.findOne({
        where: { E_EmailAddress: data.hospitalMailId },
    });

    if (emailExists) {
        // throw new BadRequestException(`Hospital with email ${data.hospitalMailId} already exists.`);
    }

    const rohiniIdExists = await this.entityPropertyRepository.findOne({
        where: { EP_PropertyName: 'TMH_RohiniCode', EP_ISACTIVE: true, EP_PropertyValue: data.rohiniCode }
    });

    if (rohiniIdExists) {
        // throw new BadRequestException(`RohiniId with ${data.rohiniCode} already exists.`);
    }

    this.logger.log('Existing mail id:', emailExists);

    const existingHospitals = await this.entityRepository.find();
    const existingRohiniCodes = await this.entityPropertyRepository.find({
        where: { EP_PropertyName: 'TMH_RohiniCode', EP_ISACTIVE: true }
    });

    let similarHospitals: any = [];

    for (const hospital of existingHospitals) {
        const hospitalNameSimilarity = this.calculateSimilarity(hospital.E_FullName, data.hospitalName);
        const addressSimilarity = this.calculateSimilarity(hospital.E_PrimaryAddress, data.address);
        const pinCodeSimilarity = this.calculateSimilarity(hospital.E_PinCode, data.pinCode);
        const emailSimilarity = this.calculateSimilarity(hospital.E_EmailAddress, data.hospitalMailId);

        // Always check the Rohini code, regardless of other similarities
        const matchedRohiniCode = existingRohiniCodes.find(
            rohini => Number(rohini.EP_E_ID) === hospital.E_Id
        );

        const rohiniCode = matchedRohiniCode ? matchedRohiniCode.EP_PropertyValue : null;
        const rohiniCodeSimilarity = this.calculateSimilarity(rohiniCode, data.rohiniCode);

        // Push to similarHospitals based on any relevant similarities
        if (
            hospitalNameSimilarity > this.SIMILARITY_THRESHOLD || 
            addressSimilarity > this.SIMILARITY_THRESHOLD || 
            pinCodeSimilarity > this.SIMILARITY_THRESHOLD ||
            rohiniCodeSimilarity > this.SIMILARITY_THRESHOLD // Check Rohini code similarity too
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

    if (similarHospitals.length > 0) {
        throw new BadRequestException({
            message: 'Similar hospitals found with the following similarity percentages:',
            similarHospitals,
        });
    }

    try {
        // Logic to create a new hospital
        this.logger.log('Hospital created successfully');
    } catch (error) {
        this.logger.error('Error while creating hospital:', error.message);
        throw new BadRequestException('Failed to create hospital.');
    }
}


  // Similarity calculation helper function
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
