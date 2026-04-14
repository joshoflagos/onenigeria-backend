import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, AUTH_METHODS, CurrentIdentity } from '@odysseon/whoami-adapter-nestjs';
import type { AnyAuthMethods, Receipt } from '@odysseon/whoami-core';
import type { Request, Response } from 'express';
import {
  LoginDto,
  RegisterDto,
  TokenResponseDto,
  ChangePasswordDto,
} from '../dto/auth.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { PrismaService } from '../../prisma.service';
import { SendVerificationEmailUseCase } from '../../verification/usecases/send-verification-email.usecase';
import { VerifyEmailUseCase } from '../../verification/usecases/verify-email.usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_METHODS) private readonly auth: AnyAuthMethods,
    private readonly sendVerificationEmail: SendVerificationEmailUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly prisma: PrismaService,
  ) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register with email + password' })
  async register(@Body() dto: RegisterDto): Promise<TokenResponseDto> {
    const receipt = await this.auth.registerWithPassword!({
      email: dto.email,
      password: dto.password,
    });

    await this.sendVerificationEmail.execute(receipt.accountId.value, dto.email);

    return { token: receipt.token };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email + password' })
  async login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    const receipt = await this.auth.authenticateWithPassword!({
      email: dto.email,
      password: dto.password,
    });
    return { token: receipt.token };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleLogin(): void {
    // Passport handles the redirect to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const receipt = req.user as Receipt;

    // Auto-verify email for OAuth users (Google already verified it)
    await this.prisma.oneNigeriaUser.upsert({
      where: { accountId: receipt.accountId.value },
      create: { accountId: receipt.accountId.value, isVerified: true },
      update: { isVerified: true },
    });

    res.json({ token: receipt.token });
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with OTP' })
  async verifyEmail(
    @CurrentIdentity('accountId') accountId: string,
    @Body() dto: VerifyEmailDto,
  ) {
    await this.verifyEmailUseCase.execute(accountId, dto.otp);
    return { message: 'Email verified successfully' };
  }

  @Public()
  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  async resendVerification(@Body() dto: ResendVerificationDto) {
    const account = await this.prisma.account.findUnique({
      where: { email: dto.email },
    });

    if (account) {
      await this.sendVerificationEmail.execute(account.id, dto.email);
    }

    return { message: 'If an account exists, a verification email has been sent' };
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password (authenticated)' })
  async changePassword(
    @Req() req: Request,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    if (!this.auth.changePassword) {
      throw new Error('Password authentication is not configured');
    }

    await this.auth.changePassword({
      receiptToken: token,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });

    return { message: 'Password updated successfully' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentIdentity('accountId') accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { oneNigeriaUser: true },
    });

    const profile = account?.oneNigeriaUser;
    const { otp, otpExpiry, resetToken, resetTokenExpiry, ...safeProfile } = profile || {};

    return {
      id: account?.id,
      email: account?.email,
      ...safeProfile,
    };
  }
}
