import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateUserDataDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  entityId: string;
}

export class CreateUserDto {
  @IsBoolean()
  isBulkUpload: boolean;

  @IsOptional()
  file?: any;

  @IsNotEmpty()
  userData: CreateUserDataDto;

  @IsOptional()
  @IsObject()
  roles?: Record<string, string>; // Key-value pair for roleId and roleName
}
