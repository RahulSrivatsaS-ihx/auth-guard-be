import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateHospitalDto } from './CreateHospitalDto';
import { HospitalCreationService } from './HospitalCreation.service';

@Controller('hospitalCreation')
export class HospitalCreationController {
  constructor(private readonly hospitalCreationService: HospitalCreationService) {}

  @Post()
  async createHospital(@Body() body: CreateHospitalDto): Promise<{ message: any,data: any }> {
    try {
    const acknowledgement =  await this.hospitalCreationService.createOrMapHospital(body);
    return { 
      message: `Hospital created successfully ${JSON.stringify(acknowledgement)}`,
      data: acknowledgement // Success response
    };

    } catch (error) {
      throw new BadRequestException(error.message); // Forward error message
    }
  }
}
