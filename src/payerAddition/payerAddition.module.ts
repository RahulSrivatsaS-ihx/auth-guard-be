import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { PayerAdditionService } from "./payerAddition.service";
import { PayerAdditionController } from "./payerAddition.controller";

@Module({
  imports: [TypeOrmModule.forFeature([EntityPropertyEntity],'IHXSupremeConnection'),
],

  providers: [PayerAdditionService],
  controllers: [PayerAdditionController],
})
export class PayerAdditionModule {}

