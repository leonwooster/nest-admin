import { Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import supertest from 'supertest';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService extends AbstractService {
        constructor(
                @InjectRepository(Role) private readonly roleRepository: Repository<Role>
        ) {
                super(roleRepository)
        }
}
