import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ImageStorageService } from '../../storage/image-storage.service';

@Injectable()
export class UserAvatarService {
  constructor(
    private readonly imageUploadService: ImageStorageService,
    private readonly prisma: PrismaService,
  ) {}

  async updateUserAvatar(
    accountId: string,
    originalFileName: string,
    fileData: Buffer,
  ) {
    const user = await this.prisma.oneNigeriaUser.findUnique({
      where: { accountId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const oldAvatarId = user.avatar;

    // Upload new image
    const uploadResult = await this.imageUploadService.handleImageUpload(
      originalFileName,
      fileData,
    );

    // Update database
    const updatedUser = await this.prisma.oneNigeriaUser.update({
      where: { accountId },
      data: { avatar: uploadResult.url },
    });

    // Clean up old image safely
    if (oldAvatarId) {
      this.imageUploadService.handleImageDeletion(oldAvatarId).catch((err) => {
        console.error('Non-fatal error: Failed to delete old avatar', err);
      });
    }

    return updatedUser;
  }
}
