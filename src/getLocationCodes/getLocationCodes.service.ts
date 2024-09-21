// lookup.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TblLookupEntity } from 'src/hospitalCreation/masterLookUpLocationCodes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LookupService {
  constructor(
    @InjectRepository(TblLookupEntity, 'IHXSupremeConnection') // Specify your connection
    private readonly tblLookupRepository: Repository<TblLookupEntity>,
  ) {}

  async findLocationByValue(type: string,value: string): Promise<TblLookupEntity[]> {
    console.log('Received value:', type,value);
    return this.tblLookupRepository
      .createQueryBuilder('lookup')
      .select('lookup.MLU_ID') // Select only the MLU_ID column
      .where('lookup.MLU_LOOK_UP_COLUMN_NAME = :name',  { name: type })
      .andWhere('lookup.MLU_LOOK_UP_COLUMN_VALUE = :value', { value })
      .take(10)
      .getMany();
  }

}
