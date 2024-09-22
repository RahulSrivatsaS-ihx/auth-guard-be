import { Injectable } from '@nestjs/common';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { CreateHospitalDto } from './CreateHospitalDto';
import { calculateSimilarity } from 'src/utils/utils';

@Injectable()
export class SimilarityCheckService {
  private readonly SIMILARITY_THRESHOLD = 90;

  findSimilarHospitals(
    existingHospitals: EntityTbl_Entity[],
    existingRohiniCodes: EntityPropertyEntity[],
    data: CreateHospitalDto,
  ) {
    return existingHospitals.reduce((acc, hospital) => {
      const hospitalNameSimilarity = calculateSimilarity(
        hospital.E_FullName,
        data.hospitalName,
      );
      const addressSimilarity = calculateSimilarity(
        hospital.E_PrimaryAddress,
        data.address,
      );
      const pinCodeSimilarity = calculateSimilarity(
        hospital.E_PinCode,
        data.pinCode,
      );
      const emailSimilarity = calculateSimilarity(
        hospital.E_EmailAddress,
        data.hospitalMailId,
      );

      const matchedRohiniCode = existingRohiniCodes.find(
        (rohini) => Number(rohini.EP_E_ID) === hospital.E_Id,
      );
      const rohiniCodeSimilarity = matchedRohiniCode
        ? calculateSimilarity(
            matchedRohiniCode.EP_PropertyValue,
            data.rohiniCode,
          )
        : 0;

      if (
        hospitalNameSimilarity > this.SIMILARITY_THRESHOLD ||
        addressSimilarity > this.SIMILARITY_THRESHOLD ||
        pinCodeSimilarity > this.SIMILARITY_THRESHOLD ||
        rohiniCodeSimilarity > this.SIMILARITY_THRESHOLD
      ) {
        acc.push({
          referenceId: hospital.E_Id,
          hospitalName: hospital.E_FullName,
          address: hospital.E_PrimaryAddress,
          pinCode: hospital.E_PinCode,
          email: hospital.E_EmailAddress,
          rohiniCode: matchedRohiniCode
            ? matchedRohiniCode.EP_PropertyValue
            : null,
          hospitalNameSimilarity,
          addressSimilarity,
          pinCodeSimilarity,
          emailSimilarity,
          rohiniCodeSimilarity,
        });
      }
      return acc;
    }, []);
  }
}
