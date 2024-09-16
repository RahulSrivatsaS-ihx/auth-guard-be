
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { TblApplicationUserEntity } from './tblApplicationUser.entity';
import { EntityTbl_Entity } from './entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityTbl_Entity],'IHXSupremeConnection'),
  TypeOrmModule.forFeature([TblApplicationUserEntity], 'MediAuthConnection') // Connection for AuthEntity (if used)
],

  providers: [InfoService],
  controllers: [InfoController],
})
export class InfoModule {}

