import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleService } from './role.service';

@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {

    constructor(private roleService: RoleService)
    {

    }

    @Get()
    async all()
    {
        return await this.roleService.all(["permissions"]);
    }    
    
    @Post()
    async create(
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    )
    {
        /*
            use of the map
            passed in permission ids [1,2]

            will become

            [
                {id:1}, {id:2}
            ]
        */
        return await this.roleService.create({
            name,
            permissions: ids.map(id => ({id}))
        });
    }

    @Get(':id')
    async get(@Param('id') id: number)
    {
        return await this.roleService.findOne({id: id}, ["permissions"]);
    }

    @Put(':id')
    async update(        
        @Param('id', ParseIntPipe) id: number, 
        @Body('name') name:string,
        @Body('permissions') ids: number[],
        ){
        
        await this.roleService.update(id, {
            name,            
        });

        const role = await this.roleService.findOne({id: id}, ["permissions"]);

        return await this.roleService.create({
           ...role,
           permissions: ids.map(id => ({id}))
        });
    }

    @Delete(":id")
    async delete(@Param("id") id: number)
    {
        return this.roleService.delete(id);
    }
}
