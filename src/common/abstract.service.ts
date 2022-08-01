import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PagginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {

    protected constructor(
        readonly repository : Repository<any>
    )
    {

    }

    async all(relations:any[]): Promise<any[]> {
        return await this.repository.find({relations: relations});
    }

    async paginate(page: number = 1, relations:any[] = []): Promise<PagginatedResult> {
        const take = 1;

        const [data, total] = await this.repository.findAndCount({
            take,
            skip: (page - 1) * take,
            relations: relations
        });

        return {
            data: data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
    }

    async create(data: any): Promise<any> {
        return await this.repository.save(data);
    }

    async findOne(condition: any, relations: any[] = []): Promise<any> {
        return await this.repository.findOne({ where: condition, relations: relations });
    }

    async update(id: number, data: any): Promise<any> {
        return await this.repository.update(id, data);
    }

    async delete(id: number): Promise<any> {
        return await this.repository.delete(id);
    }
}
 