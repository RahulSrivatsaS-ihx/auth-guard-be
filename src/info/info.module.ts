
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityPropertyEntity } from './entity_Property.entity';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { TblApplicationUserEntity } from './tblApplicationUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntityPropertyEntity],'IHXSupremeConnection'),
  TypeOrmModule.forFeature([TblApplicationUserEntity], 'MediAuthConnection') // Connection for AuthEntity (if used)
],

  providers: [InfoService],
  controllers: [InfoController],
})
export class InfoModule {}

