import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { FeatureEnablingService } from "./featureEnabling.service";

@Controller('featureEnabling')
export class FeatureEnablingController {
  constructor(private readonly featureEnablingService: FeatureEnablingService) {}

  @Post()
  async updateFeature(@Body() body: {
    isBulkUpload: boolean;
    EP_E_ID: string;
    enablement: boolean;
    features: Record<string, boolean>;
  }): Promise<{ messages: string[] }> {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('At least one key-value pair must be provided');
    }
    try {
      const messages = await this.featureEnablingService.updateFeature(body);
      return { messages }; // Return messages in the response
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
