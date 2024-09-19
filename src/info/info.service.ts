import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getInfo(params: Record<string, any>): Promise<any[]> {
    try {
      const repository = this.getRepositoryBasedOnParams(params.isHospitalUpdate);
      const alias = this.getAlias(params.isHospitalUpdate);
      const columns = this.getColumns(params.isHospitalUpdate);
  
      console.log('Selected Columns:', columns);
  
      const queryBuilder = repository.createQueryBuilder(alias).select(columns);
      this.addConditions(queryBuilder, params);
  
      this.logQuery(queryBuilder);
  
      const results = await queryBuilder.getMany();

      // Check if results are empty and throw an exception
      if (results.length === 0) {
        throw new NotFoundException('No data available for the provided parameters.');
      }

      return results;
    } catch (error) {
      this.handleError('getInfo', error);
      throw error;
    }
  }

  async updateRecord(params: { isHospitalUpdate: boolean; id: Record<string, any>; update_fields: Record<string, any>; }): Promise<void> {
    try {
      const repository = this.getRepositoryBasedOnParams(params.isHospitalUpdate);
      const { id, update_fields } = params;
      const existingRecord = await repository.findOne({ where: id }); // For composite key

      if (!existingRecord) {
        throw new NotFoundException('Record not found for the provided ID.');
      }
        await repository.update(id, update_fields);

      this.logger.log(`Record updated successfully: ${JSON.stringify({ id, update_fields })}`);
    } catch (error) {
      this.handleError('updateRecord', error);
      throw error;
    }
  }

  private getRepositoryBasedOnParams(isHospitalUpdate: boolean): Repository<any> {
    return isHospitalUpdate ? this.infoRepository : this.authRepository;
  }

  private getAlias(isHospitalUpdate: boolean): string {
    return isHospitalUpdate ? 'EntityTbl_Entity' : 'TblApplicationUser';
  }

  private getColumns(isHospitalUpdate: boolean): string[] {
    return isHospitalUpdate 
      ? QUERY_CONSTANTS.ENTIT_TBL_COLUMNS 
      : QUERY_CONSTANTS.TBL_APPLICATION_USER_COLUMNS;
  }

  private addConditions(queryBuilder: any, params: Record<string, any>): void {
    const filteredParams = { ...params };
    delete filteredParams.isHospitalUpdate;

    Object.keys(filteredParams).forEach((key, index) => {
      queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :value${index}`, {
        [`value${index}`]: filteredParams[key],
      });
    });
  }

  private logQuery(queryBuilder: any): void {
    const sql = queryBuilder.getSql();
    this.logger.log(`Generated Query: ${sql}`);
  }

  private handleError(method: string, error: any): void {
    this.logger.error(`Error in ${method}: ${error.message}`, error.stack);
  }
}
