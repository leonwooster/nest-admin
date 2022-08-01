import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    )
    {
        console.debug("User Controller initialized");
    }

    @Get()
    async all(@Query('page') page: number = 1): Promise<User[]> {
        return await this.userService.paginate(page, ["role"]);
    }    

    @Put("info")
    async updateInfo(
        @Body() body: UserUpdateDto,
        @Req() request: Request,
    )
    {
        const id = await this.authService.userId(request);

        await this.userService.update(id, body);

        return await this.userService.findOne({id: id}, ["role"]);
    }

    @Put("password")
    async updatePassword(    
        @Req() request: Request,
        @Body("password") password: string,
        @Body("password_confirm") password_confirm: string,
    )
    {
        if (password !== password_confirm) {
            throw new BadRequestException("Password does not match");
        }

        const id = await this.authService.userId(request);

        const hashed = await bcrypt.hash(password, 12);

        await this.userService.update(id, {
            password: hashed,
        });

        return await this.userService.findOne({id: id}, ["role"]);
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await bcrypt.hash('1234',12);
        
        return await this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            role: {id: body.role_id},
            password: password
        });
    }

    @Get(':id')
    async get(@Param('id') id: number)
    {
        return await this.userService.findOne({id: id}, ["role"]);
    }

    @Put(':id')
    async update(        
        @Param('id', ParseIntPipe) id: number, 
        @Body() body: UserUpdateDto) {
        
        const {role_id, ...data} = body;
        await this.userService.update(id, {...data, role:{id: role_id}});

        return await this.userService.findOne({id: id}, ["role"]);
    }

    @Delete(":id")
    async delete(@Param("id") id: number)
    {
        return this.userService.delete(id);
    }
}
