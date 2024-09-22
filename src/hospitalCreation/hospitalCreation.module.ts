
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { HospitalCreationController } from './hospitalCreation.controller';
import { TblPayerMasterLookUpEntity } from './TblPayerMasterLookUp.entity';
import { TblLookupEntity } from './masterLookUpLocationCodes.entity';
import { LookupService } from 'src/getLocationCodes/getLocationCodes.service';
import { TblProfileDetailEntity } from './ProfileDetail.entity';
import { SimilarityCheckService } from './SimilarityCheck.service';
import { HospitalDatabaseService } from './HospitalDatabase.service';
import { HospitalCreationService } from './hospitalCreations.service';
import { UserCreationModule } from 'src/userCreation/userCreation.module';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTbl_Entity],'IHXSupremeConnection'),
  TypeOrmModule.forFeature([EntityPropertyEntity], 'IHXSupremeConnection'),
  TypeOrmModule.forFeature([TblProfileDetailEntity], 'ValhallaConnection') ,
  TypeOrmModule.forFeature([TblPayerMasterLookUpEntity],'IhxProviderConnection'),
  TypeOrmModule.forFeature([TblLookupEntity],'IHXSupremeConnection'),UserCreationModule


],

  providers: [HospitalCreationService, SimilarityCheckService, HospitalDatabaseService,LookupService],
  controllers: [HospitalCreationController],
})
export class HospitalCreationModule {}

