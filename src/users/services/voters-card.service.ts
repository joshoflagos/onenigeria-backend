import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ImageStorageService } from '../../storage/image-storage.service';

@Injectable()
export class VotersCardService {
  constructor(
    private readonly imageUploadService: ImageStorageService,
    private readonly prisma: PrismaService
  ) { }

  async updateVotersCard(accountId: string, originalFileName: string, fileData: Buffer) {
    const user = await this.prisma.oneNigeriaUser.findUnique({
      where: { accountId }
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const oldVotersCardUrl = user.votersCard;

    // Upload new image
    const uploadResult = await this.imageUploadService.handleImageUpload(
      originalFileName,
      fileData
    );

    // Update database
    const updatedUser = await this.prisma.oneNigeriaUser.update({
      where: { accountId },
      data: { votersCard: uploadResult.url },
    });

    // Clean up old image safely
    if (oldVotersCardUrl) {
      this.imageUploadService.handleImageDeletion(oldVotersCardUrl).catch(err => {
        console.error("Non-fatal error: Failed to delete old voters card", err);
      });
    }

    return updatedUser;
  }
}
