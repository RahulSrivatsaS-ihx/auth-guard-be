import { IsNotEmpty, IsEmail, IsString, Matches, IsObject, IsPhoneNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHospitalDto {
  @IsNotEmpty()
  @IsBoolean()
  isBulkUpload: boolean;

  @IsOptional()
  file: any; // You can specify a more specific type if you know the structure (e.g., Express.Multer.File)

@IsOptional()
isCashlessPayer: boolean;

  @IsNotEmpty()
  @IsString()
  hospitalName: string;

  @IsString()
  @IsOptional() // Marking it optional since the request example allows this field to be missin
  payerHospitalId: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Pin code must be 6 digits' })
  pinCode: string;

  @IsNotEmpty()
  @IsEmail()
  hospitalMailId: string;

  @IsNotEmpty()
  @IsString()
  rohiniCode: string;

  @IsNotEmpty()
  @IsString()
  stateName: string;

  @IsNotEmpty()
  @IsString()
  cityName: string;

  // @IsNotEmpty()
  // @IsString()
  // userName: string;

  // @IsNotEmpty()
  // @IsString()
  // firstName: string;

  // @IsNotEmpty()
  // @IsString()
  // lastName: string;

  // @IsNotEmpty()
  // @IsString()
  // gender: string;

  // @IsNotEmpty()
  // @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  // phoneNumber: string;

 
  @IsOptional()
  @IsObject()
  roles?: Record<string, string>; // Key-value pair for roleId and roleName
}
