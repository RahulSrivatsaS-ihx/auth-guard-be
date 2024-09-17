import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { HospitalCreationService } from './hospitalCreation.service';
import { CreateHospitalDto } from './CreateHospitalDto';

@Controller('hospitalCreation')
export class HospitalCreationController {
  constructor(private readonly hospitalCreationService: HospitalCreationService) {}

  @Post()
  async createHospital(@Body() body: CreateHospitalDto): Promise<void> {
    try {
      await this.hospitalCreationService.hospitalCreation(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
