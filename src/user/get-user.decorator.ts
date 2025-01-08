import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from './entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserModel => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
