import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityPropertyEntity } from "src/info/entity_Property.entity";
import { PayerAdditionService } from "./payerAddition.service";
import { PayerAdditionController } from "./payerAddition.controller";
import { TblPayerMasterLookUpEntity } from "src/hospitalCreation/TblPayerMasterLookUp.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EntityPropertyEntity],'IHXSupremeConnection'),
  TypeOrmModule.forFeature([TblPayerMasterLookUpEntity],'IhxProviderConnection'),
],

  providers: [PayerAdditionService],
  controllers: [PayerAdditionController],
})
export class PayerAdditionModule {}

