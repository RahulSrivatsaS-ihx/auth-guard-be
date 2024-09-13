// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { databaseConfig, authDatabaseConfig } from './config/database.config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { infoModule } from './info/info.module';
// import { AuthModule } from './auth/auth.module';
// import { Info } from './info/info';
// @Module({
//   imports: [
//     // TypeOrmModule.forRoot(databaseConfig), // Ensure databaseConfig is correctly set up
//     TypeOrmModule.forFeature([Info]),
//     TypeOrmModule.forRoot(databaseConfig), // Use the main database config
//     TypeOrmModule.forRoot(authDatabaseConfig), // Added auth database config
//     infoModule,
//     AuthModule
//   ],
//   controllers: [AppController],
//   providers: [AppService, AuthModule],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { InfoModule } from './info/info.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig), // Ensure this line is included
    InfoModule, // Ensure this module is imported
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService,AuthModule],
})
export class AppModule {
  constructor() {
    console.log('Environment file path:', `${process.cwd()}/env/.${process.env.NODE_ENV}.env`);
    console.log('Database Config:', databaseConfig);
    console.log('Environment Variables:', process.env);
  }
}

