
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityTbl_Entity } from 'src/info/entity.entity';
import { EntityPropertyEntity } from 'src/info/entity_Property.entity';
import { HospitalCreationController } from './hospitalCreation.controller';
import { HospitalCreationService } from './hospitalCreation.service';
import { TblProfileDetailEntity } from './ProfileDetailEntity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTbl_Entity],'IHXSupremeConnection'),
  TypeOrmModule.forFeature([EntityPropertyEntity], 'IHXSupremeConnection'),
  TypeOrmModule.forFeature([TblProfileDetailEntity], 'ValhallaConnection') ,
//   TypeOrmModule.forFeature([Entity_Entity], 'IHXSupremeConnection') 
],

  providers: [HospitalCreationService],
  controllers: [HospitalCreationController],
})
export class HospitalCreationModule {}

