import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { PartiesModule } from './parties/parties.module';
import { VerificationModule } from './verification/verification.module';
import { MailerModule } from './mailer/mailer.module';
import { PasswordResetModule } from './password-reset/password-reset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PartiesModule,
    MailerModule,
    PasswordResetModule,
  ],
})
export class AppModule {}
