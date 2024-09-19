import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblPayerMasterLookUpEntity } from "src/hospitalCreation/TblPayerMasterLookUp.entity";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { Repository } from "typeorm";

@Injectable()
export class PayerAdditionService {
  private readonly logger = new Logger(PayerAdditionService.name);

  constructor(
    @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
    private readonly updatePayerRepository: Repository<EntityPropertyEntity>,
    @InjectRepository(TblPayerMasterLookUpEntity, 'IhxProviderConnection')
    private readonly tblPayerMasterLookUpEntity: Repository<TblPayerMasterLookUpEntity>,
  ) {}

  async updatePayers(params: {
    isBulkUpload: boolean;
    supremeId: string;
    isPayerAddition: boolean;
    selectedPayers: Record<string, string>;
  }): Promise<string[]> {
    const messages: string[] = [];

    try {
      const { supremeId, isPayerAddition, selectedPayers } = params;

      // Check if supremeId exists
      const existingEntity = await this.updatePayerRepository.findOne({
        where: { EP_E_ID: supremeId }
      });

      if (!existingEntity) {
        this.logger.error(`Entity with supremeId ${supremeId} not found.`);
        throw new Error(`Entity with supremeId ${supremeId} not found.`);
      }

      // Fetch the "ConfiguredPayer" property for the entity
      const configuredPayer = await this.updatePayerRepository.findOne({
        where: { EP_E_ID: supremeId, EP_PropertyName: 'ConfiguredPayer' }
      });

      if (configuredPayer) {
        let currentPayers = configuredPayer.EP_PropertyValue ? configuredPayer.EP_PropertyValue.split(',') : [];

        for (const payerId of Object.keys(selectedPayers)) {
          if (isPayerAddition) {
            // Add payer if not already present
            if (!currentPayers.includes(payerId)) {
              currentPayers.push(payerId);
              messages.push(`Added ${payerId} to ConfiguredPayer for supremeId ${supremeId}`);
            }
          } else {
            // Remove payer if present
            currentPayers = currentPayers.filter(payer => payer !== payerId);
            messages.push(`Removed ${payerId} from ConfiguredPayer for supremeId ${supremeId}`);
          }
        }

        // Update the property with the new comma-separated list of payers
        await this.updatePayerRepository.update(
          { EP_E_ID: supremeId, EP_PropertyName: 'ConfiguredPayer' },
          { EP_PropertyValue: currentPayers.join(',') }
        );
      } else if (isPayerAddition) {
        // Insert a new property if ConfiguredPayer doesn't exist
        const newProperty = this.updatePayerRepository.create({
          EP_E_ID: supremeId,
          EP_PropertyName: 'ConfiguredPayer',
          EP_PropertyValue: Object.keys(selectedPayers).join(','),
          EP_ISACTIVE: true,
          EP_ADDUSER: 1,
          EP_CREATEDON: new Date(),
          EP_MODIFIEDUSER: 1,
          EP_MODIFIEDON: new Date(),
          EP_GroupId: 0,
          EP_LookUpId: 0,
          ProductCode: 'DefaultProductCode'
        });

        await this.updatePayerRepository.save(newProperty);
        messages.push(`Inserted new ConfiguredPayer property for supremeId ${supremeId}`);
      }
    } catch (error) {
      this.logger.error('Failed to update payers', error.stack);
      throw error;
    }

    return messages;
  }
}
