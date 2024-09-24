
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IhxProviderConfig, IHXSupremeConfig,MediAuthConfig, ValhallaConfig } from './config/database.config';
import { InfoModule } from './info/info.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FeatureUpdateModule } from './featureEnabling.ts/featureEnabling.module';
import { PayerAdditionModule } from './payerAddition/payerAddition.module';
import { UserCreationModule } from './userCreation/userCreation.module';
import { HospitalCreationModule } from './hospitalCreation/hospitalCreation.module';
import { LookupModule } from './getLocationCodes/getLocationCodes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(MediAuthConfig), 
    TypeOrmModule.forRoot(IHXSupremeConfig),
    TypeOrmModule.forRoot(ValhallaConfig),
    TypeOrmModule.forRoot(IhxProviderConfig),

    InfoModule, 
    AuthModule,
    FeatureUpdateModule,
    PayerAdditionModule,
    UserCreationModule,
    HospitalCreationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ui'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService,AuthModule,FeatureUpdateModule,PayerAdditionModule,UserCreationModule,HospitalCreationModule,LookupModule],
 
})
export class AppModule {
  constructor() {
    console.log('Environment file path:', `${process.cwd()}/env/.${process.env.NODE_ENV}.env`);
    console.log('Database Config:', IHXSupremeConfig);
    console.log('Database Config:', MediAuthConfig);
    console.log('Database Config:', ValhallaConfig);
    console.log('Database Config:', IhxProviderConfig);
    console.log('Environment Variables:', process.env);
  }
}

