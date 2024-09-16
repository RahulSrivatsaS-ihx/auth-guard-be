import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { FeatureEnablingService } from "./featureEnabling.service";
import { FeatureEnablingController } from "./featureEnabling.controller";


@Module({
  imports: [TypeOrmModule.forFeature([EntityPropertyEntity],'IHXSupremeConnection'),
],

  providers: [FeatureEnablingService],
  controllers: [FeatureEnablingController],
})
export class FeatureUpdateModule {}

