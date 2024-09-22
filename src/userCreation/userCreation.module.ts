import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblApplicationUserEntity } from "src/info/tblApplicationUser.entity";
import { UserCreationService } from "./userCreation.service";
import { UserCreationController } from "./userCreation.controller";
import { TblUserMapRoleEntity } from "./TblUserMap_Role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([TblApplicationUserEntity, TblUserMapRoleEntity], 'MediAuthConnection'),
  ],

  providers: [UserCreationService],
  controllers: [UserCreationController],
  exports: [UserCreationService],

})
export class UserCreationModule {}

