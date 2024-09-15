import { Controller, Body, BadRequestException, UseGuards, Post, Get } from '@nestjs/common';
import { InfoService } from './info.service';
// import { Info } from './entity_Property.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EntityPropertyEntity } from './entity_Property.entity';

@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}
  
  @UseGuards(JwtAuthGuard) // Protect this route with the JWT guard
  @Post()
  async getInfo(@Body() body: Record<string, string | number>): Promise<EntityPropertyEntity[]> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('At least one key-value pair must be provided');
    }

    try {
      return await this.infoService.getInfo(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
