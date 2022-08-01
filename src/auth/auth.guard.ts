import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { debug } from 'console';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {

  }

  canActivate(context: ExecutionContext,) {
    const request = context.switchToHttp().getRequest();
    debug("calling auth guard");    
    try {
      const jwt = request.cookies['jwt'];
      return this.jwtService.verifyAsync(jwt);
    }
    catch (error) {
      return false;
    }
  }
}
