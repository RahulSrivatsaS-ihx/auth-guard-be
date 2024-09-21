import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TblPayerMasterLookUpEntity } from "src/hospitalCreation/TblPayerMasterLookUp.entity";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { Repository } from "typeorm";
import { GovernmentPayerDTO, NonGovernmentPayerDTO, PayerDTO } from "./payerAddition.dto";
import { getPayerId } from "src/utils/constants";

@Injectable()
export class PayerAdditionService {
  private readonly logger = new Logger(PayerAdditionService.name);

  constructor(
    @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
    private readonly updatePayerRepository: Repository<EntityPropertyEntity>,
    @InjectRepository(TblPayerMasterLookUpEntity, 'IhxProviderConnection')
    private readonly tblPayerMasterLookUpEntity: Repository<TblPayerMasterLookUpEntity>,
  ) {}

  async updatePayers(params: PayerDTO): Promise<string[]> {
    const messages: string[] = [];
    
    try {
      console.log('isGovernmentPayer:', params); // Log the property
      // Handle government payers
      
      if ('isGovernmentScheme' in params && params.isGovernmentScheme) {
        console.log('Processing government payers...');
        const { cmsID, E_ID, GovernmentSchemes } = params as GovernmentPayerDTO;
        messages.push(...await this.processGovernmentPayers(cmsID, E_ID, GovernmentSchemes));
      } 
      // Handle non-government payers
      else {
        console.log('Processing non-government payers...'); // Log this to debug
        const { supremeId, PayerProviderId } = params as NonGovernmentPayerDTO;
        // messages.push(...await this.processNonGovernmentPayers(supremeId, PayerProviderId));
      }
    } catch (error) {
      this.logger.error('Failed to update payers', error.stack);
      throw error;
    }
    
    return messages;
  }

  private async processGovernmentPayers(cmsID: string, E_ID: string, GovernmentSchemes: string[]): Promise<string[]> {
    const messages: string[] = [];

    const existingEntity = await this.updatePayerRepository.findOne({ where: { EP_E_ID: E_ID } });
    if (!existingEntity) {
        this.logger.error(`Entity with E_ID ${E_ID} not found.`);
        throw new Error(`Entity with E_ID ${E_ID} not found.`);
    }

    const governmentConfig = await this.updatePayerRepository.findOne({
        where: { EP_E_ID: E_ID, EP_PropertyName: 'Govt_Scheme' }
    });

    let currentSchemes: string[] = [];
    if (governmentConfig) {
        currentSchemes = governmentConfig.EP_PropertyValue ? governmentConfig.EP_PropertyValue.split(',') : [];
        const newSchemes = [...new Set([...currentSchemes, ...GovernmentSchemes])];
        governmentConfig.EP_PropertyValue = newSchemes.join(',');
        await this.updatePayerRepository.save(governmentConfig);
        messages.push(`Updated Govt_Scheme for E_ID ${E_ID} with schemes: ${newSchemes.join(', ')}`);
    } else {
        const newProperty = this.updatePayerRepository.create({
            EP_E_ID: E_ID,
            EP_PropertyName: 'Govt_Scheme',
            EP_PropertyValue: GovernmentSchemes.join(','),
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
        messages.push(`Created new Govt_Scheme for E_ID ${E_ID} with schemes: ${GovernmentSchemes.join(', ')}`);
    }

    // Check for existing row in tblPayerMasterLookUpEntity
    const existingLookup = await this.tblPayerMasterLookUpEntity.findOne({ where: { PayerMasterId: cmsID } });

    if (existingLookup) {
        // If it exists, update IsActive to true
        existingLookup.IsActive = true;
        await this.tblPayerMasterLookUpEntity.save(existingLookup);
        messages.push(`Updated IsActive to true for existing PayerMasterId ${cmsID}`);
    } else {
        // Create a new row in tblPayerMasterLookUpEntity
        const insertNewRowPayerMasterLookup = this.tblPayerMasterLookUpEntity.create({
            MasterType: 9,
            PayerMasterId: cmsID,
            PayerId: String(getPayerId(cmsID)),
            MAMasterTableName: 'pmr.entity',
            MaMasterId: E_ID,
            IsActive: true,
            CreatedOn: new Date(),
            ModifiedOn: new Date(),
            PayerSchemeCode: GovernmentSchemes.join(','),
            Createdby: 1,
        });

        await this.tblPayerMasterLookUpEntity.save(insertNewRowPayerMasterLookup);
        messages.push(`Inserted new row in tblPayerMasterLookUpEntity for CMS ID ${cmsID} and E_ID ${E_ID}`);
    }

    return messages;
}

// private async processNonGovernmentPayers(supremeId: string, PayerProviderId: string): Promise<string[]> {
//   const messages: string[] = [];

//   const existingEntity = await this.updatePayerRepository.findOne({
//       where: { EP_E_ID: supremeId }
//   });

//   if (!existingEntity) {
//       this.logger.error(`Entity with supremeId ${supremeId} not found.`);
//       throw new Error(`Entity with supremeId ${supremeId} not found.`);
//   }

//   // Check for existing row in tblPayerMasterLookUpEntity
//   const existingLookup = await this.tblPayerMasterLookUpEntity.findOne({ where: { PayerMasterId: PayerProviderId } });

//   if (existingLookup) {
//       // If it exists, update IsActive to true
//       existingLookup.IsActive = true;
//       await this.tblPayerMasterLookUpEntity.save(existingLookup);
//       messages.push(`Updated IsActive to true for existing PayerMasterId ${PayerProviderId}`);
//   } else {
//       // Create a new row for PayerMasterLookUp
//       const insertNewRowPayerMasterLookup = this.tblPayerMasterLookUpEntity.create({
//           MasterType: 9,
//           PayerMasterId: PayerProviderId,
//           PayerId: String(getPayerId(PayerProviderId)),
//           MAMasterTableName: 'pmr.entity',
//           MaMasterId: supremeId,
//           IsActive: true,
//           CreatedOn: new Date(),
//           ModifiedOn: new Date(),
//           Createdby: 1,
//       });

//       await this.tblPayerMasterLookUpEntity.save(insertNewRowPayerMasterLookup);
//       messages.push(`Inserted new row in tblPayerMasterLookUpEntity for supremeId ${supremeId}`);
//   }

//   // Fetch the "ConfiguredPayer" property
//   const configuredPayer = await this.updatePayerRepository.findOne({
//       where: { EP_E_ID: supremeId, EP_PropertyName: 'ConfiguredPayer' }
//   });

//   if (configuredPayer) {
//       let currentPayers = configuredPayer.EP_PropertyValue ? configuredPayer.EP_PropertyValue.split(',') : [];
      
//       if (!currentPayers.includes(PayerProviderId)) {
//           currentPayers.push(PayerProviderId);
//           messages.push(`Added ${PayerProviderId} to ConfiguredPayer for supremeId ${supremeId}`);
//       }

//       await this.updatePayerRepository.update(
//           { EP_E_ID: supremeId, EP_PropertyName: 'ConfiguredPayer' },
//           { EP_PropertyValue: currentPayers.join(',') }
//       );

//   } else {
//       const newProperty = this.updatePayerRepository.create({
//           EP_E_ID: supremeId,
//           EP_PropertyName: 'ConfiguredPayer',
//           EP_PropertyValue: PayerProviderId,
//           EP_ISACTIVE: true,
//           EP_ADDUSER: 1,
//           EP_CREATEDON: new Date(),
//           EP_MODIFIEDUSER: 1,
//           EP_MODIFIEDON: new Date(),
//           EP_GroupId: 0,
//           EP_LookUpId: 0,
//           ProductCode: 'DefaultProductCode'
//       });

//       await this.updatePayerRepository.save(newProperty);
//       messages.push(`Inserted new ConfiguredPayer property for supremeId ${supremeId}`);
//   }

//   return messages;
// }

}
