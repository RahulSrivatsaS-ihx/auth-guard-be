import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Info } from './info.entity';

@Injectable()
export class InfoService {
  private readonly logger = new Logger(InfoService.name);

  constructor(
    @InjectRepository(Info)
    private readonly infoRepository: Repository<Info>,
  ) {}

  // Method to fetch all data and log the query
  async getAllInfo(): Promise<Info[]> {
    const queryBuilder = this.infoRepository.createQueryBuilder('Entity');
    this.logger.log('Generated Query: ' + queryBuilder.getSql()); // Log the query
    return queryBuilder.getMany();
  }

  // Method to fetch data based on parameters and log the query
  async getInfo(params: Record<string, string | number>): Promise<Info[]> {

    console.log('dta aaaaaaaaaaa',params)
    const queryBuilder = this.infoRepository.createQueryBuilder('Entity');
    console.log('dta bbbbbbbbbbbb',params)

    Object.keys(params).forEach((key, index) => {
      queryBuilder.andWhere(`Entity.${key} = :value${index}`, { [`value${index}`]: params[key] });
    });

    this.logger.log('Generated Query: ' + queryBuilder.getSql()); // Log the query
    return queryBuilder.getMany();
  }
}
