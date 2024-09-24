import { Injectable, BadRequestException, Logger, HttpException } from '@nestjs/common';
import { CreateHospitalDto } from './CreateHospitalDto';
import { SimilarityCheckService } from './SimilarityCheck.service';
import { HospitalDatabaseService } from './HospitalDatabase.service';
import { CreateUserDto } from 'src/userCreation/create-user.dto';
import { UserCreationService } from 'src/userCreation/userCreation.service';

@Injectable()
export class HospitalCreationService {
  private readonly logger = new Logger(HospitalCreationService.name);

  // Similarity thresholds
  private readonly HIGH_SIMILARITY_THRESHOLD = 95;
  private readonly MODERATE_SIMILARITY_THRESHOLD = 75;
  private readonly SIMILARITY_WEIGHT = 0.25;

  constructor(
    private readonly similarityCheckService: SimilarityCheckService,
    private readonly hospitalDatabaseService: HospitalDatabaseService,
    private readonly userCreationService: UserCreationService,
  ) {}

  // Main function to handle hospital creation or mapping
  async createOrMapHospital(data: CreateHospitalDto): Promise<any> {
    console.log('Data received:', data);
    try {

      // throw new BadRequestException({message:'Failed to create or map hospital: '});
      


      const { emailExists, rohiniExists } = await this.hospitalDatabaseService.checkExistingData(
        data.hospitalMailId,
        data.rohiniCode,
      );

      this.logger.log(`Email Exists: ${emailExists}, Rohini Exists: ${rohiniExists}`);

      if (rohiniExists) {
        return await this.handleRohiniExists(data);
      } else {
        return await this.handleNewHospitalCreation(data);
      }
    } catch (error) {
      this.logger.error('Error during hospital creation:', error);
      throw new BadRequestException('Failed to create or map hospital: ' + error.message);
    }
  }

  // Handle scenario where Rohini ID exists
  private async handleRohiniExists(data: CreateHospitalDto): Promise<any> {
    const { hospitals } = await this.hospitalDatabaseService.getExistingHospitalsAndRohiniCodes();
    const similarHospitals = this.similarityCheckService.findSimilarHospitals(hospitals, data);

    const matchedHospital = this.findHighSimilarityHospital(similarHospitals);
console.log('matchedHospital', matchedHospital);
    if (matchedHospital) {
      return await this.mapToExistingHospital(matchedHospital, data);
    } else {
      this.logger.warn(`No sufficient match (${this.HIGH_SIMILARITY_THRESHOLD}%) found for the provided Rohini ID`);
       return await this.handleNewHospitalCreation(data);
    }
  }

  // Find a hospital with high similarity (>=95%)
  private findHighSimilarityHospital(similarHospitals: any[]): any {
    console.log('in high similarity');

    return similarHospitals.find(hospital => {
      return (
        hospital.hospitalNameSimilarity >= this.HIGH_SIMILARITY_THRESHOLD &&
        hospital.addressSimilarity >= this.HIGH_SIMILARITY_THRESHOLD &&
        hospital.pinCodeSimilarity >= this.HIGH_SIMILARITY_THRESHOLD &&
        hospital.emailSimilarity >= this.HIGH_SIMILARITY_THRESHOLD
      );
    });
  }

  // Map a matched hospital to Payer Provider ID
  private async mapToExistingHospital(matchedHospital: any, data: CreateHospitalDto): Promise<any> {
    try {
      await this.hospitalDatabaseService.createPayerMasterLookUp(matchedHospital.referenceId, data);
      await this.hospitalDatabaseService.updateConfiguredPayer(matchedHospital.referenceId, data.payerHospitalId);

      const hospitalDetails = await this.hospitalDatabaseService.getHospitalDetails(matchedHospital.referenceId);
      this.logger.log(`Mapped SupremeId ${matchedHospital.referenceId} with Payer Provider ID`);

      return hospitalDetails;
    } catch (error) {
      this.logger.error(`Error while mapping SupremeId ${matchedHospital.referenceId} with Payer Provider ID: ${error}`);
      throw new HttpException('Error while mapping SupremeId with Payer Provider ID', 500);
    }
  }

  // Handle scenario where no match is found, create a new hospital
  private async handleNewHospitalCreation(data: CreateHospitalDto): Promise<any> {
    const { hospitals } = await this.hospitalDatabaseService.getExistingHospitalsAndRohiniCodes();
    const similarHospitals = this.similarityCheckService.findSimilarHospitals(hospitals, data);

    const matchedHospital = this.findModerateSimilarityHospital(similarHospitals);

    if (matchedHospital) {
      return await this.mapToExistingHospital(matchedHospital, data);
    }

    return await this.createNewHospital(data);
  }

  // Find a hospital with moderate similarity (>=75%)
  private findModerateSimilarityHospital(similarHospitals: any[]): any {
    console.log('in moderate similarity');
    return similarHospitals.find(hospital => {
      const totalSimilarity = (hospital.hospitalNameSimilarity * this.SIMILARITY_WEIGHT) +
        (hospital.addressSimilarity * this.SIMILARITY_WEIGHT) +
        (hospital.pinCodeSimilarity * this.SIMILARITY_WEIGHT) +
        (hospital.emailSimilarity * this.SIMILARITY_WEIGHT);


        console.log('totalSimilarity', totalSimilarity,hospital.hospitalNameSimilarity, hospital.addressSimilarity, hospital.pinCodeSimilarity, hospital.emailSimilarity);
      return totalSimilarity >= this.MODERATE_SIMILARITY_THRESHOLD;
    });
  }

  // Create a new hospital and return its details
  private async createNewHospital(data: CreateHospitalDto): Promise<any> {
    try {
      const hospitalId = await this.hospitalDatabaseService.createHospitalAndProperties(data);
      console.log('this.createUserDto', this.buildUserDto(hospitalId, data));
      const userDto: CreateUserDto = this.buildUserDto(hospitalId, data);

      if (data.isCashlessPayer && data.roles) {
        await this.userCreationService.createUser(userDto);
      }

      const hospitalDetails = await this.hospitalDatabaseService.getHospitalDetails(hospitalId);
      this.logger.log(`Created new hospital (${hospitalDetails.E_Id}) and user, user password is been mailed to the ${hospitalDetails.E_Id}`);

      return `Created new hospital (${hospitalDetails.E_Id}) and user, user password is been mailed to the ${hospitalDetails.E_EmailAddress}`;
    } catch (error) {
      this.logger.error('Error during new hospital creation:', error);
      throw new HttpException('Failed to create hospital and user', 500);
    }
  }

  // Helper function to build user DTO
  private buildUserDto(hospitalId: number, data: CreateHospitalDto): CreateUserDto {
    return {
      isBulkUpload: false,
      userData: {
        phoneNumber: '1234567890',
        gender: 'Male',
        entityId: String(hospitalId),
        firstName: data.hospitalName,
        lastName: null,
        username: data.hospitalName,
        email: data.hospitalMailId,
      },
      roles: data.roles,
    };
  }
}
