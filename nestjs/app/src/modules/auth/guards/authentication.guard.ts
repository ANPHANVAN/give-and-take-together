import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
// import { Logger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { IPayloadJWT } from '../interfaces/IPayloadJWT';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // private logger: Logger,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const accessToken: string | undefined =
      req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) throw new UnauthorizedException();
    try {
      const decoded = this.jwtService.verify<IPayloadJWT>(accessToken);
      req.userInfo = decoded;
      return true;
    } catch (error) {
      res.clearCookie('accessToken');
      throw new UnauthorizedException();
    }
  }
}
