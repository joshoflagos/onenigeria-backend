import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageProvider } from './ports/provider.port';
import { CloudinaryStorageProvider } from './adapters/cloudinary.adapter';
import { CloudinaryProvider } from './adapters/cloudinary.provider';
import { ImageStorageService } from './image-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    CloudinaryProvider,
    ImageStorageService,
    {
      provide: StorageProvider,
      useClass: CloudinaryStorageProvider,
    },
  ],
  exports: [StorageProvider, ImageStorageService],
})
export class StorageModule {}
