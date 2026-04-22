import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserAvatarService } from './services/avatar.service';
import { AvatarController } from './controllers/avatar.controller';
import { VotersCardService } from './services/voters-card.service';
import { VotersCardController } from './controllers/voters-card.controller';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [StorageModule, MailerModule],
  controllers: [UsersController, AvatarController, VotersCardController],
  providers: [UsersService, UserAvatarService, VotersCardService],
})
export class UsersModule {}
