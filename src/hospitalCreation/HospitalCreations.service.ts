import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateHospitalDto } from './CreateHospitalDto';
import { SimilarityCheckService } from './SimilarityCheck.service';
import { HospitalDatabaseService } from './HospitalDatabase.service';
import { CreateUserDto } from 'src/userCreation/create-user.dto';
import { UserCreationService } from 'src/userCreation/userCreation.service';

@Injectable()
export class HospitalCreationService {
  private readonly logger = new Logger(HospitalCreationService.name);

  constructor(
    private readonly similarityCheckService: SimilarityCheckService,
    private readonly hospitalDatabaseService: HospitalDatabaseService,
    private readonly userCreationService: UserCreationService,
  ) {}

  async hospitalCreation(data: CreateHospitalDto): Promise<void> {
    try {

      await this.hospitalDatabaseService.checkExistingMailId(data.hospitalMailId);
      await this.hospitalDatabaseService.checkExistingRohiniCode(data.rohiniCode)
      
      const existingHospitals = await this.hospitalDatabaseService.getExistingHospitals();
      const existingRohiniCodes = await this.hospitalDatabaseService.getExistingRohiniCodes();

      const similarHospitals = this.similarityCheckService.findSimilarHospitals(
        existingHospitals,
        existingRohiniCodes,
        data,
      );
      console.log('Similar Hospitals:', similarHospitals);

      if (similarHospitals.length > 0) {
        throw new BadRequestException({
          message: 'Similar hospitals found with the following similarity percentages:',
          similarHospitalsDetails: similarHospitals,
        });
      }
      const hospitalId = await this.hospitalDatabaseService.createHospitalAndProperties(data);
console.log('hospitalId',hospitalId)
      await this.hospitalDatabaseService.createHospitalAndProperties(data);
      const userDto: CreateUserDto = {
        isBulkUpload: false,
        userData: {
          phoneNumber: data.phoneNumber,
          gender:'Male',
          entityId: String(hospitalId),
          firstName: data.hospitalName, 
          lastName: null,
          username: data.hospitalName,
          email: data.hospitalMailId,
        },
        roles:data.roles
      };
    
      await this.userCreationService.createUser(userDto);

    } catch (error) {
      this.logger.error('Error during hospital creation:', error);
      throw new BadRequestException('Failed to create hospital: ' + error.message);
    }
  }
}
