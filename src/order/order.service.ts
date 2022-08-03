import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PagginatedResult } from 'src/common/paginated-result.interface';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {
        super(orderRepository);
    }

    async paginate(page: number = 1, relations:any[] = []): Promise<any> {
        const {data, meta} = await super.paginate(page, relations);

        return {
            data: data.map((order: Order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,                             
            })),
            meta
        }
    }
}
