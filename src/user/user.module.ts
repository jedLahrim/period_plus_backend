import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from './entities/user.entity';
import { jwtStrategy } from './strategy/jwt.strategy';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel]), AttachmentModule],
  controllers: [UserController],
  providers: [UserService, jwtStrategy],
})
export class UserModule {}
