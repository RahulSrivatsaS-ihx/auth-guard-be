import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";

@Controller('featureEnabling')
export class InfoController {
  constructor(private readonly featureEnablingService: featureEnablingService) {}
  
  // @UseGuards(JwtAuthGuard) // Protect this route with the JWT guard
  @Post()
  async getInfo(@Body() body: Record<string, string | number>): Promise<EntityPropertyEntity[]> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('At least one key-value pair must be provided');
    }
    try {
      return await this.featureEnablingService.getInfo(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }




}
