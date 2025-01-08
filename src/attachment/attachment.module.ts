import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [S3Client, AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
