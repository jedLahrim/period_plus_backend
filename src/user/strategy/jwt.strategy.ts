import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserModel } from '../entities/user.entity';

export interface JwtPayload {
  id: string;
}

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserModel)
    private userRepo: Repository<UserModel>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<UserModel> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id=:id', { id: payload.id })
      .getOne();
    if (!user) throw new UnauthorizedException('ERR_UNAUTHORIZED');

    return user;
  }
}
