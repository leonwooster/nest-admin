import { Controller, Get } from '@nestjs/common';
import { HasPermission } from './has-permission.decorator';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {

    constructor(private permissionService: PermissionService)
    {

    }

    @Get()
    @HasPermission("view_users")
    async all()
    {
        return await this.permissionService.all([]);
    }
}
