import { IsNotEmpty, IsEmail, IsString, Matches } from 'class-validator';

export class CreateHospitalDto {
  @IsNotEmpty()
  @IsString()
  hospitalName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  cityName: string;

  @IsNotEmpty()
  @IsString()
  stateName: string;

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
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsString()
  payerHospitalId: string;
}
