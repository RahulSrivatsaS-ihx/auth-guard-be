import { Injectable } from '@nestjs/common';
import { CreateHospitalDto } from './CreateHospitalDto';

export function calculateSimilarity(value1: string | number, value2: string | number): number {
  // Convert both values to strings
  const str1 = String(value1);
  const str2 = String(value2);

  if (!str1 || !str2) return 0;

  const value1Lower = str1.toLowerCase(); // Lowercase for case-insensitive comparison
  const value2Lower = str2.toLowerCase();

  let matches = 0;
  const length = Math.max(value1Lower.length, value2Lower.length);

  for (let i = 0; i < length; i++) {
    if (value1Lower[i] === value2Lower[i]) {
      matches++;
    }
  }

  return (matches / length) * 100;
}

@Injectable()
export class SimilarityCheckService {
  private calculateSimilarity(str1: string | number, str2: string | number): number {
    return calculateSimilarity(str1, str2);
  }

  findSimilarHospitals(hospitals, data: CreateHospitalDto) {
    return hospitals.map((hospital) => {
      return {
        referenceId: hospital.E_Id,
        hospitalNameSimilarity: this.calculateSimilarity(hospital.E_DisplayName, data.hospitalName),
        addressSimilarity: this.calculateSimilarity(hospital.E_PrimaryAddress, data.address),
        pinCodeSimilarity: this.calculateSimilarity(hospital.E_PinCode, data.pinCode),
        emailSimilarity: this.calculateSimilarity(hospital.E_EmailAddress, data.hospitalMailId),
      };
    });
  }
}
