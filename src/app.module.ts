import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PeriodModule } from './period/period.module';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { AttachmentModule } from './attachment/attachment.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: +process.env.PORT,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      retryDelay: 5000,
      synchronize: true,
    }),
    UserModule,
    PeriodModule,
    ArticleModule,
    AttachmentModule,
  ],
})
export class AppModule {}
