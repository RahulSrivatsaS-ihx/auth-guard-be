import { IsString, IsArray, IsNotEmpty, IsBoolean } from 'class-validator';

// Define a type for government payer data
export class GovernmentPayerDTO {
  @IsBoolean()
  @IsNotEmpty()
  isGovernmentScheme: boolean; // This will be true for government schemes

  @IsString()
  @IsNotEmpty()
  cmsID: string; // CMS ID specific to government payers

  @IsString()
  @IsNotEmpty()
  E_ID: string; // Additional ID for government payers

  @IsArray()
  @IsNotEmpty()
  GovernmentSchemes: string[]; // An array of government schemes

  @IsBoolean()
  @IsNotEmpty()
  isBulkUpload: boolean; // Whether it's a bulk upload
}

// Define a type for non-government payer data
export class NonGovernmentPayerDTO {
  @IsBoolean()
  @IsNotEmpty()
  isGovernmentPayer: boolean; // This will be false for non-government payers

  @IsString()
  @IsNotEmpty()
  supremeId: string; // Supreme ID specific to non-government payers

  @IsString()
  @IsNotEmpty()
  PayerProviderId: string; // Payer provider ID specific to non-government payers

  @IsBoolean()
  @IsNotEmpty()
  isBulkUpload: boolean; // Whether it's a bulk upload
}

// A union type that can be either a government payer or a non-government payer
export type PayerDTO = GovernmentPayerDTO | NonGovernmentPayerDTO;
