// lookup.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TblLookupEntity } from 'src/hospitalCreation/masterLookUpLocationCodes.entity';
import { LookupController } from './getLocationCodes.controller';
import { LookupService } from './getLocationCodes.service';

@Module({
  imports: [TypeOrmModule.forFeature([TblLookupEntity], 'IHXSupremeConnection')],
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
