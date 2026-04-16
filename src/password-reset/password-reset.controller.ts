import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@odysseon/whoami-adapter-nestjs';
import { SendPasswordResetEmailUseCase } from './usecases/send-password-reset-email.usecase';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class PasswordResetController {
  constructor(
    private readonly sendPasswordResetEmail: SendPasswordResetEmailUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.sendPasswordResetEmail.execute(dto.email);
    return { message: 'If an account exists, a reset email has been sent' };
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(dto.token, dto.newPassword);
    return { message: 'Password reset successful' };
  }
}
