// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Info } from './info';
// import { InfoService } from './info.service';
// import { InfoController } from './info.controller';

// @Module({
//   // imports: [TypeOrmModule.forFeature([info])],
//   imports: [TypeOrmModule.forFeature([Info])],

//   providers: [InfoService],
//   controllers: [InfoController],
// })
// export class infoModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from './info.entity';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Info])],
  providers: [InfoService],
  controllers: [InfoController],
})
export class InfoModule {}

