import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TblApplicationUserEntity } from "src/info/tblApplicationUser.entity";
import { UserCreationService } from "./userCreation.service";
import { UserCreationController } from "./userCreation.controller";

@Module({
    imports: [  TypeOrmModule.forFeature([TblApplicationUserEntity], 'MediAuthConnection') // Connection for AuthEntity (if used)

],

  providers: [UserCreationService],
  controllers: [UserCreationController],
})
export class UserCreationModule {}

