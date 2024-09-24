import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateHospitalDto } from './CreateHospitalDto';
import { HospitalCreationService } from './HospitalCreation.service';

@Controller('hospitalCreation')
export class HospitalCreationController {
  constructor(private readonly hospitalCreationService: HospitalCreationService) {}

  @Post()
  async createHospital(@Body() body: CreateHospitalDto): Promise<{ message: string }> {
    try {
    const acknowledgement =  await this.hospitalCreationService.createOrMapHospital(body);
      return { message: acknowledgement || `Hospital created successfully ${JSON.stringify(acknowledgement)}` }; // Success response
    } catch (error) {
      throw new BadRequestException(error.message); // Forward error message
    }
  }
}
