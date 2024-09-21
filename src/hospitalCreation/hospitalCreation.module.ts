
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { HospitalCreationController } from './hospitalCreation.controller';
import { HospitalCreationService } from './hospitalCreation.service';
import { TblPayerMasterLookUpEntity } from './TblPayerMasterLookUp.entity';
import { TblLookupEntity } from './masterLookUpLocationCodes.entity';
import { LookupService } from 'src/getLocationCodes/getLocationCodes.service';
import { TblProfileDetailEntity } from './ProfileDetail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTbl_Entity],'IHXSupremeConnection'),
  TypeOrmModule.forFeature([EntityPropertyEntity], 'IHXSupremeConnection'),
  TypeOrmModule.forFeature([TblProfileDetailEntity], 'ValhallaConnection') ,
  TypeOrmModule.forFeature([TblPayerMasterLookUpEntity],'IhxProviderConnection'),
  TypeOrmModule.forFeature([TblLookupEntity],'IHXSupremeConnection'),


],

  providers: [HospitalCreationService,LookupService],
  controllers: [HospitalCreationController],
})
export class HospitalCreationModule {}

