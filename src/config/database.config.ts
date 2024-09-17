// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { config } from 'dotenv';
// import { Info } from 'src/info/info';

// // Load environment variables
// config();

// // Log the environment variables to ensure they are loaded
// console.log('Database config:', {
//   host: process.env.SQL_DB_SERVER,
//   user: process.env.SQL_DB_USER,
//   database: process.env.SQL_DATA_BASE
// });

// export const databaseConfig: TypeOrmModuleOptions = {
//   // type: 'mssql',
//   // host: process.env.SQL_DB_SERVER || 'localhost',
//   // port: 3306, // Default port for MSSQL
//   // username: process.env.SQL_DB_USER,
//   // password: process.env.SQL_DB_PASSWORD,
//   // database: process.env.SQL_DATA_BASE,
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   // synchronize: false,
//   type: 'mysql',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT, 10) || 3306,
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'myrootpassword',
//   database: process.env.DB_DATABASE || 'IHXSupreme',
//   // entities: [info], // Replace with your entities
//   synchronize: true, // Use false in production
//   // options: {
//   //   encrypt: true,   // Set this to false
//   //   trustServerCertificate: true, // Change to true for local dev / self-signed certs
//   //   connectTimeout: 60000, // Set to 30 seconds (30000 ms)

//   // }
// };

// export const authDatabaseConfig: TypeOrmModuleOptions = {
//   // type: 'mssql',
//   // host: process.env.SQL_DB_SERVER || 'localhost',
//   // port: 3306,
//   // username: process.env.SQL_DB_USER,
//   // password: process.env.SQL_DB_PASSWORD,
//   // database: process.env.SQL_AUTH_DATA_BASE,
//   // entities: [__dirname + '/../auth/**/*.entity{.ts,.js}'], // Adjust path as necessary
//   // synchronize: false,
//   type: 'mysql',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT, 10) || 3306,
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'myrootpassword',
//   database: process.env.DB_DATABASE || 'database1',
//   // entities: [User], // Replace with your entities
//   synchronize: true, // Use false in production
//   // options: {
//   //   encrypt: true,   // Set this to false
//   //   trustServerCertificate: true, // Change to true for local dev / self-signed certs
//   //   connectTimeout: 60000, // Set to 30 seconds (30000 ms)

//   // }
//   // options: {
//   //   encrypt: true,
//   //   trustServerCertificate: true,
//   //   connectTimeout: 60000, // Set to 30 seconds (30000 ms)

//   // },
// };

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
const synchronize = process.env.DB_SYNCHRONISATION === 'true';
const logging = process.env.DB_LOGGING === 'true';
const dbType = process.env.DB_TYPE || 'mysql'; // Default to MySQL if not specified

console.log('eeeeeeeeeee',process.env.DB_USER)
// export const databaseConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT, 10) || 3306,
//   username: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'myrootpassword',
//   database: process.env.DB_DATABASE || 'IHXSupreme',
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: synchronize || false, // Set to false in production
//   logging: logging || false, // Enable logging to see the queries
//   extra: {
//     encrypt: true,   // Use encryption if needed
//     trustServerCertificate: true, // Change to true for local dev / self-signed certs
//     connectTimeout: 10000, // Set to 30 seconds (30000 ms)
//   },}

// export const databaseConfig: TypeOrmModuleOptions = {
//   type: 'mssql', // Change to 'mssql' for SQL Server
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT, 10) || 1433, // Default port for SQL Server is 1433
//   username: process.env.DB_USER || 'sqlserver',
//   password: process.env.DB_PASSWORD || 'yourpassword', // Ensure correct password
//   database: process.env.DB_DATABASE || 'IHXSupreme',
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: synchronize, // Set to false in production
//   logging: logging, // Enable logging to see the queries
//   extra: {
//     encrypt: true,   // Use encryption if needed
//     trustServerCertificate: true, // Change to true for local dev / self-signed certs
//     connectTimeout: 60000, // Set to 30 seconds (30000 ms)
//   },
// };







//working for stg

// export const databaseConfig: TypeOrmModuleOptions = {
//   type: 'mssql', // Change to 'mssql' for SQL Server
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10), // Default port for SQL Server is 1433
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD, // Ensure correct password
//   database: process.env.DB_DATABASE,
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: synchronize, // Set to false in production
//   logging: logging, // Enable logging to see the queries
//   extra: {
//     encrypt: true,   // Use encryption if needed
//     trustServerCertificate: true, // Change to true for local dev / self-signed certs
//     connectTimeout: 60000, // Set to 30 seconds (30000 ms)
//   },
// };


//working for local
export const IHXSupremeConfig: TypeOrmModuleOptions = {
  name: 'IHXSupremeConnection',
  type: 'mysql',// Change to 'mssql' for SQL Server
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: synchronize, // Set to false in production
  logging: logging, // Enable logging to see the queries
  extra: {
    encrypt: true,   // Use encryption if needed
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
    connectTimeout: 60000, // Set to 30 seconds (30000 ms)
  },}

  export const MediAuthConfig: TypeOrmModuleOptions = {
    name: 'MediAuthConnection',
    type: 'mysql',// Change to 'mssql' for SQL Server
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MEDIAUTH_DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: synchronize, // Set to false in production
    logging: logging, // Enable logging to see the queries
    extra: {
      encrypt: true,   // Use encryption if needed
      trustServerCertificate: true, // Change to true for local dev / self-signed certs
      connectTimeout: 60000, // Set to 30 seconds (30000 ms)
    },}

    export const hospProfileConfig: TypeOrmModuleOptions = {
      name: 'hospProfileConnection',
      type: 'mysql',// Change to 'mssql' for SQL Server
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_HOSPITAL_PROFILE_DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: synchronize, // Set to false in production
      logging: logging, // Enable logging to see the queries
      extra: {
        encrypt: true,   // Use encryption if needed
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
        connectTimeout: 60000, // Set to 30 seconds (30000 ms)
      },}