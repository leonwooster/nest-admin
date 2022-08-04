import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
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
                order_items: order.order_items, 
            })),
            meta
        }
    }

    async chart()
    {
        return this.orderRepository.query(
            `      
            select DATE_FORMAT(o.created_at, '%y-%m-%d') as date, sum(oi.price * oi.quantity) as sum 
            from orders o INNER join order_items oi on o.id = oi.order_id group by date
            `
        );
    }
}
