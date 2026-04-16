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
import { AccountId } from '@odysseon/whoami-core';
import { VotersCardService } from '../services/voters-card.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('onenigeria/user')
@UseGuards(WhoamiAuthGuard)
export class VotersCardController {
  constructor(private readonly votersCardService: VotersCardService) {}

  @Post('voters-card')
  @ApiOperation({ summary: 'Upload voters card' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        votersCard: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('votersCard'))
  async uploadVotersCard(
    @CurrentIdentity('accountId') accountId: AccountId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No voters card image provided.');
    }

    return await this.votersCardService.updateVotersCard(
      accountId.value,
      file.originalname,
      file.buffer,
    );
  }
}
