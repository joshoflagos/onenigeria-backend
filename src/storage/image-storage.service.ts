import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import { StorageProvider } from './ports/provider.port';

@Injectable()
export class ImageStorageService {
  private allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
  private allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

  constructor(private readonly storageProvider: StorageProvider) { }

  async handleImageUpload(originalFileName: string, fileData: Buffer) {
    const extension = path.extname(originalFileName).toLowerCase();

    if (!this.allowedExtensions.includes(extension)) {
      throw new BadRequestException(`${extension} is not a supported image format.`);
    }

    const fileInfo = await fileTypeFromBuffer(fileData);
    if (!fileInfo || !this.allowedMimeTypes.includes(fileInfo.mime)) {
      throw new BadRequestException("The file content is not a valid image.");
    }

    const safeFileName = `${uuidv4()}${extension}`;
    return await this.storageProvider.upload(safeFileName, fileData);
  }

  async handleImageDeletion(fileId: string) {
    return await this.storageProvider.delete(path.basename(fileId));
  }
}
