import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { builtinModules } from 'module';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Request } from 'express';
import { AuthInterceptor } from './auth.interceptor';

@Controller()
@UseInterceptors(ClassSerializerInterceptor, AuthInterceptor)
export class AuthController {

    constructor(private readonly userService: UserService, private jwtService: JwtService) {

    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.password_confirm) {
            throw new BadRequestException("Password does not match");
        }

        const hashed = await bcrypt.hash(body.password, 12);

        return await this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed
        });
    }

    @Post("login")
    async login(@Body("email") email: string, @Body("password") password: string, @Res({ passthrough: true }) response: Response) {
        const user = await this.userService.findOne({ email: email });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException("Invalid credential");
        }

        const jwt = await this.jwtService.signAsync({ id: user.id });

        response.cookie('jwt', jwt, { httpOnly: true });

        return user;
    }
    
    @Get('user')
    async user(@Req() requst: Request) {
        const cookie = requst.cookies['jwt'];

        const data = await this.jwtService.verifyAsync(cookie);

        console.log(data);

        return this.userService.findOne({ id: data['id'] });
    }

    @Post('logout')
    async logout(@Res() response: Response) 
    {
        response.clearCookie('jwt');

        return {
            message: 'success',
        }
    }
}
