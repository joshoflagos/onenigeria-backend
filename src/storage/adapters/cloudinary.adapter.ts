import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as path from 'path';
import { CLOUDINARY } from './cloudinary.provider';
import { StorageProvider } from '../ports/provider.port';

@Injectable()
export class CloudinaryStorageProvider implements StorageProvider {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
  ) {}

  async upload(fileName: string, fileData: Buffer): Promise<{ url: string }> {
    return new Promise((resolve, reject) => {
      const publicId = path.parse(fileName).name;

      const uploadStream = this.cloudinary.uploader.upload_stream(
        { public_id: publicId, folder: 'user-avatars', resource_type: 'image' },
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary Upload Error:', error);
            return reject(
              new InternalServerErrorException('Failed to upload image.'),
            );
          }
          resolve({ url: result.secure_url });
        },
      );

      streamifier.createReadStream(fileData).pipe(uploadStream);
    });
  }

  async delete(fileUrl: string): Promise<{ success: boolean }> {
    try {
      const fileNameWithExt = path.basename(fileUrl);
      const publicId = `user-avatars/${path.parse(fileNameWithExt).name}`;

      await this.cloudinary.uploader.destroy(publicId);
      return { success: true };
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      return { success: false };
    }
  }
}
