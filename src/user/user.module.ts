import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from './entities/user.entity';
import { jwtStrategy } from './strategy/jwt.strategy';
import { AttachmentModule } from '../attachment/attachment.module';
import { PeriodModule } from '../period/period.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    AttachmentModule,
    PeriodModule,
  ],
  controllers: [UserController],
  providers: [UserService, jwtStrategy],
})
export class UserModule {}
