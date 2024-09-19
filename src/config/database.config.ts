
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
const envFilePath = resolve(process.cwd(), `env/.${process.env.NODE_ENV}.env`);
config({ path: envFilePath });
// config()

// Log environment variables for debugging
console.log('path ',`env/.${process.env.NODE_ENV}.env`)
console.log('Loaded environment variables:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_SYNCHRONISATION: process.env.DB_SYNCHRONISATION,
  DB_LOGGING: process.env.DB_LOGGING,
});
const logging = process.env.DB_LOGGING === 'true';




//working for stg

export const IHXSupremeConfig: TypeOrmModuleOptions = {
  name: 'IHXSupremeConnection',
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: false, 
  logging: logging, 
  extra: {
    encrypt: true,  
    trustServerCertificate: true,
    connectTimeout: 10000, 
  },
};

export const MediAuthConfig: TypeOrmModuleOptions = {
name: 'MediAuthConnection',
type: 'mssql',
host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT, 10),
username: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_MEDIAUTH_DATABASE,
entities: [__dirname + '/../**/*.entity.{js,ts}'],
synchronize: false, 
logging: logging, 
extra: {
  encrypt: true,
  trustServerCertificate: true,
  connectTimeout: 10000,
},
};

export const ValhallaConfig: TypeOrmModuleOptions = {
name: 'ValhallaConnection',
type: 'mssql',
host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT, 10),
username: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_VALHALLA_DATABASE,
entities: [__dirname + '/../**/*.entity.{js,ts}'],
synchronize: false,
logging: logging, // Enable logging to see the queries
extra: {
  encrypt: true,   // Use encryption if needed
  trustServerCertificate: true, // Change to true for local dev / self-signed certs
  connectTimeout: 10000, // Set to 30 seconds (30000 ms)
},
};

export const IhxProviderConfig: TypeOrmModuleOptions = {
  name: 'IhxProviderConnection',

type: 'mssql', // Change to 'mssql' for SQL Server
host: process.env.DB_HOST,
port: parseInt(process.env.DB_PORT, 10), // Default port for SQL Server is 1433
username: process.env.DB_USER,
password: process.env.DB_PASSWORD, // Ensure correct password
database: process.env.DB_IHX_PROVIDER_DATABASE,
entities: [__dirname + '/../**/*.entity.{js,ts}'],
synchronize: false, // Set to false in production
logging: logging, // Enable logging to see the queries
extra: {
  encrypt: true,   // Use encryption if needed
  trustServerCertificate: true, // Change to true for local dev / self-signed certs
  connectTimeout: 10000, // Set to 30 seconds (30000 ms)
},
};
//working for local
// export const IHXSupremeConfig: TypeOrmModuleOptions = {
//   name: 'IHXSupremeConnection',
//   type: 'mysql',// Change to 'mssql' for SQL Server
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: synchronize, // Set to false in production
//   logging: logging, // Enable logging to see the queries
//   extra: {
//     encrypt: true,   // Use encryption if needed
//     trustServerCertificate: true, // Change to true for local dev / self-signed certs
//     connectTimeout: 60000, // Set to 30 seconds (30000 ms)
//   },}

  // export const MediAuthConfig: TypeOrmModuleOptions = {
  //   name: 'MediAuthConnection',
  //   type: 'mysql',// Change to 'mssql' for SQL Server
  //   host: process.env.DB_HOST,
  //   port: parseInt(process.env.DB_PORT, 10),
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_MEDIAUTH_DATABASE,
  //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
  //   synchronize: synchronize, // Set to false in production
  //   logging: logging, // Enable logging to see the queries
  //   extra: {
  //     encrypt: true,   // Use encryption if needed
  //     trustServerCertificate: true, // Change to true for local dev / self-signed certs
  //     connectTimeout: 60000, // Set to 30 seconds (30000 ms)
  //   },}

    // export const hospProfileConfig: TypeOrmModuleOptions = {
    //   name: 'hospProfileConnection',
    //   type: 'mysql',// Change to 'mssql' for SQL Server
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT, 10),
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_HOSPITAL_PROFILE_DATABASE,
    //   entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //   synchronize: synchronize, // Set to false in production
    //   logging: logging, // Enable logging to see the queries
    //   extra: {
    //     encrypt: true,   // Use encryption if needed
    //     trustServerCertificate: true, // Change to true for local dev / self-signed certs
    //     connectTimeout: 60000, // Set to 30 seconds (30000 ms)
    //   },}