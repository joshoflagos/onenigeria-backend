import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CurrentIdentity,
  WhoamiAuthGuard,
} from '@odysseon/whoami-adapter-nestjs';
import { UserAvatarService } from '../services/avatar.service';
import { AccountId } from '@odysseon/whoami-core';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('onenigeria/user')
@UseGuards(WhoamiAuthGuard)
export class AvatarController {
  constructor(private readonly avatarService: UserAvatarService) {}

  @Post('avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @CurrentIdentity('accountId') accountId: AccountId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided.');
    }

    return await this.avatarService.updateUserAvatar(
      accountId.value,
      file.originalname,
      file.buffer,
    );
  }
}
