import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";


@Module({
  imports: [TypeOrmModule.forFeature([EntityPropertyEntity],'IHXSupremeConnection'),
],

  providers: [featureEnablingService],
  controllers: [featureEnablingController],
})
export class InfoModule {}

