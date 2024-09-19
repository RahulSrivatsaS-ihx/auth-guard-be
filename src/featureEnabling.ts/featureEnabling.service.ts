import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { Repository } from "typeorm";

@Injectable()
export class FeatureEnablingService {
  private readonly logger = new Logger(FeatureEnablingService.name);

  constructor(
    @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
    private readonly updateRepository: Repository<EntityPropertyEntity>,
  ) {}

  async updateFeature(params: {
    isBulkUpload: boolean;
    EP_E_ID: string;
    enablement: boolean;
    features: Record<string, boolean>;
  }): Promise<string[]> {
    const messages: string[] = []; // Collect messages

    try {
      const { EP_E_ID, enablement, features } = params;

      // Check if EP_E_ID exists
      const existingEntity = await this.updateRepository.findOne({
        where: { EP_E_ID }
      });

      if (!existingEntity) {
        this.logger.error(`Entity with EP_E_ID ${EP_E_ID} not found.`);
        throw new Error(`Entity with EP_E_ID ${EP_E_ID} not found.`);
      }

      for (const [propertyName, featureValue] of Object.entries(features)) {
        const existingProperty = await this.updateRepository.findOne({
          where: { EP_E_ID, EP_PropertyName: propertyName }
        });

        if (existingProperty) {
          await this.updateRepository.update(
            { EP_E_ID, EP_PropertyName: propertyName },
            { EP_PropertyValue: enablement ? 'true' : 'false' }
          );
          messages.push(`Updated ${propertyName} for EP_E_ID ${EP_E_ID}`);
          this.logger.log(`Updated ${propertyName} for EP_E_ID ${EP_E_ID}`);
        } else {
          // Insert a new property
          const newProperty = this.updateRepository.create({
            EP_E_ID,
            EP_PropertyName: propertyName,
            EP_PropertyValue: enablement ? 'true' : 'false',
            EP_ISACTIVE: true,
            EP_ADDUSER: 1,
            EP_CREATEDON: new Date(),
            EP_MODIFIEDUSER: 1,
            EP_MODIFIEDON: new Date(),
            EP_GroupId: 0,
            EP_LookUpId: 0,
            ProductCode: 'DefaultProductCode'
          });

          await this.updateRepository.save(newProperty);
          messages.push(`Inserted new property ${propertyName} for EP_E_ID ${EP_E_ID}`);
          this.logger.log(`Inserted new property ${propertyName} for EP_E_ID ${EP_E_ID}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to update feature', error.stack);
      throw error;
    }

    return messages; 
  }
}
