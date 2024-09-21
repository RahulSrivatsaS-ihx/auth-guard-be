// lookup.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LookupService } from './getLocationCodes.service';

@Controller('lookup')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get('state')
  async getStates(@Query('value') value: string) {
    return this.lookupService.findLocationByValue('state',value);
  }

}
