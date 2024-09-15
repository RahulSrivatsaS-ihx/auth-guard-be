import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityPropertyEntity } from './entity_Property.entity';
import { TblApplicationUserEntity } from './tblApplicationUser.entity';
import { QUERY_CONSTANTS } from 'src/utils/constants';

@Injectable()
export class InfoService {
  private readonly logger = new Logger(InfoService.name);

  constructor(
    @InjectRepository(EntityPropertyEntity, 'IHXSupremeConnection')
    private readonly infoRepository: Repository<EntityPropertyEntity>,

    @InjectRepository(TblApplicationUserEntity, 'MediAuthConnection')
    private readonly authRepository: Repository<TblApplicationUserEntity>,
  ) {}

  // Fetch data based on dynamic parameters and log query
  async getInfo(params: Record<string, string | number>): Promise<any[]> {
    try {
      const queryBuilder = this.getRepositoryBasedOnParams(params)
        .createQueryBuilder(this.getAlias(params))
        .select(this.getColumns(params));

      // Remove 'isHospitalInfo' from params before adding conditions
      this.addConditions(queryBuilder, params);
      this.logQuery(queryBuilder);
      return await queryBuilder.getMany();
    } catch (error) {
      this.handleError('getInfo', error);
      throw error;
    }
  }

  // Determine repository based on 'isHospitalInfo' flag
  private getRepositoryBasedOnParams(params: Record<string, string | number>): Repository<any> {
    return params.isHospitalInfo ? this.infoRepository : this.authRepository;
  }

  // Determine alias based on 'isHospitalInfo' flag
  private getAlias(params: Record<string, string | number>): string {
    return params.isHospitalInfo ? 'Entity_Property' : 'TblApplicationUser';
  }

  // Select appropriate columns based on 'isHospitalInfo' flag
  private getColumns(params: Record<string, string | number>): string[] {
    return params.isHospitalInfo 
      ? QUERY_CONSTANTS.ENTIT_PROPERTY_COLUMNS 
      : QUERY_CONSTANTS.TBL_APPLICATION_USER_COLUMNS;
  }

  // Add dynamic conditions to the query (excluding 'isHospitalInfo')
  private addConditions(queryBuilder: any, params: Record<string, string | number>): void {
    // Create a copy of params without 'isHospitalInfo'
    const filteredParams = { ...params };
    delete filteredParams.isHospitalInfo;

    // Add conditions for each param key except 'isHospitalInfo'
    Object.keys(filteredParams).forEach((key, index) => {
      queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :value${index}`, {
        [`value${index}`]: filteredParams[key],
      });
    });
  }

  // Log query for debugging and performance tracking
  private logQuery(queryBuilder: any): void {
    const sql = queryBuilder.getSql();
    this.logger.log(`Generated Query: ${sql}`);
  }

  // Handle and log errors for debugging purposes
  private handleError(method: string, error: any): void {
    this.logger.error(`Error in ${method}: ${error.message}`, error.stack);
  }
}
