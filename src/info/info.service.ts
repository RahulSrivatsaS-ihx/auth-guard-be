import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TblApplicationUserEntity } from './tblApplicationUser.entity';
import { QUERY_CONSTANTS } from 'src/utils/constants';
import { EntityTbl_Entity } from './entity.entity';

@Injectable()
export class InfoService {
  private readonly logger = new Logger(InfoService.name);

  constructor(
    @InjectRepository(EntityTbl_Entity, 'IHXSupremeConnection')
    private readonly infoRepository: Repository<EntityTbl_Entity>,

    @InjectRepository(TblApplicationUserEntity, 'MediAuthConnection')
    private readonly authRepository: Repository<TblApplicationUserEntity>,
  ) {}

  /**
   * Fetch data based on dynamic parameters and log query
   * @param params The query parameters
   */
  async getInfo(params: Record<string, any>): Promise<any[]> {
    try {
      // Determine repository, alias, and columns based on the `isHospitalUpdate` flag
      const repository = this.getRepositoryBasedOnParams(params.isHospitalUpdate);
      const alias = this.getAlias(params.isHospitalUpdate);
      const columns = this.getColumns(params.isHospitalUpdate);
  
      // Log selected columns for debugging
      console.log('Selected Columns:', columns);
  
      // Build query with dynamic selection
      const queryBuilder = repository.createQueryBuilder(alias).select(columns);
  
      // Add dynamic conditions (filtering out 'isHospitalUpdate')
      this.addConditions(queryBuilder, params);
  
      // Log the generated query for debugging
      this.logQuery(queryBuilder);
  
      // Execute and return the results
      return await queryBuilder.getMany();
    } catch (error) {
      this.handleError('getInfo', error);
      throw error;
    }
  }

  /**
   * Update record based on dynamic parameters
   * @param params The update parameters
   */
  async updateRecord(params: {
    isHospitalUpdate: boolean;
    id: Record<string, any>;
    update_fields: Record<string, any>;
  }): Promise<void> {
    try {
      const repository = this.getRepositoryBasedOnParams(params.isHospitalUpdate);
      const { id, update_fields } = params;

      // Perform the update operatio
      await repository.update(id, update_fields);

      // Log success message
      this.logger.log(`Record updated successfully: ${JSON.stringify({ id, update_fields })}`);
    } catch (error) {
      this.handleError('updateRecord', error);
      throw error;
    }
  }

  /**
   * Determine repository based on `isHospitalUpdate` flag
   * @param isHospitalUpdate Flag to determine which repository to use
   */
  private getRepositoryBasedOnParams(isHospitalUpdate: boolean): Repository<any> {
    return isHospitalUpdate ? this.infoRepository : this.authRepository;
  }

  /**
   * Get alias for the query based on `isHospitalUpdate` flag
   * @param isHospitalUpdate Flag to determine which alias to use
   */
  private getAlias(isHospitalUpdate: boolean): string {
    return isHospitalUpdate ? 'EntityTbl_Entity' : 'TblApplicationUser';
  }

  /**
   * Select columns based on the `isHospitalUpdate` flag
   * @param isHospitalUpdate Flag to determine which columns to select
   */
  private getColumns(isHospitalUpdate: boolean): string[] {
    return isHospitalUpdate 
      ? QUERY_CONSTANTS.ENTIT_TBL_COLUMNS  // Entity_Property columns
      : QUERY_CONSTANTS.TBL_APPLICATION_USER_COLUMNS; // TblApplicationUser columns
  }

  /**
   * Add conditions to the query dynamically
   * @param queryBuilder The query builder
   * @param params Query parameters
   */
  private addConditions(queryBuilder: any, params: Record<string, any>): void {
    const filteredParams = { ...params };
    delete filteredParams.isHospitalUpdate;  // Remove isHospitalUpdate

    // Dynamically add conditions based on params
    Object.keys(filteredParams).forEach((key, index) => {
      queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :value${index}`, {
        [`value${index}`]: filteredParams[key],
      });
    });
  }

  /**
   * Log the generated query for debugging
   * @param queryBuilder The query builder
   */
  private logQuery(queryBuilder: any): void {
    const sql = queryBuilder.getSql();
    this.logger.log(`Generated Query: ${sql}`);
  }

  /**
   * Handle and log errors for debugging
   * @param method The method where the error occurred
   * @param error The error object
   */
  private handleError(method: string, error: any): void {
    this.logger.error(`Error in ${method}: ${error.message}`, error.stack);
  }
}
