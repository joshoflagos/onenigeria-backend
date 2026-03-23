import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { ActiveUser } from './decorators/active-user.decorator';
import { AuthGuard } from '../../iam/login/decorators/auth-guard.decorator';
import { AuthType } from '../../iam/login/enums/auth-type.enum';

@ApiTags('OneNigeria Auth')
@Controller('onenigeria/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('verify-email')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-confirmation')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Resend OTP verification email' })
  @ApiResponse({ status: 200, description: 'Verification code resent' })
  async resendConfirmation(@Body() body: { email: string }) {
    return await this.authService.resendConfirmation(body.email);
  }

  @Post('login')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Request password reset code' })
  @ApiResponse({ status: 200, description: 'Reset code sent if email exists' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Reset password using code' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('onboard')
  @AuthGuard(AuthType.None)
  @ApiOperation({ summary: 'Complete user onboarding' })
  @ApiResponse({ status: 200, description: 'Onboarding successful' })
  async onboard(@Body() onboardingDto: OnboardingDto) {
    return await this.authService.onboard(onboardingDto.userId, onboardingDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @AuthGuard(AuthType.Bearer)
  @ApiOperation({ summary: 'Get current logged in user details' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  async getMe(@ActiveUser('sub') userId: string) {
    return await this.authService.getMe(userId);
  }
}
