import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import jwtConfig from '../../iam/login/config/jwt.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { OneNigeriaUser } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashingService.hash(registerDto.password);
    const otp = this.utilsService.generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // 10 minutes expiry

    const user = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await this.mailerService.sendResendMail({
      email: user.email,
      subject: 'Verify your email - OneNigeria',
      html: `<p>Your verification code is: <b>${otp}</b></p>`,
    });

    return { 
      message: 'Registration   successful. Please check your email',
      userId: user.id,
    };
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userService.findByEmail(verifyEmailDto.email);
    if (!user || user.otp !== verifyEmailDto.otp || user.otpExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.userService.update(user.id, {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    });

    return { message: 'Email verified successfully' };
  }

  async resendConfirmation(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Don't reveal whether the email exists
      return { message: 'If an account exists with this email, a new verification code has been sent.' };
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const otp = this.utilsService.generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    await this.userService.update(user.id, { otp, otpExpiry });

    await this.mailerService.sendResendMail({
      email: user.email,
      subject: 'Verify your email - OneNigeria',
      html: `<p>Your new verification code is: <b>${otp}</b></p><p>This code expires in 10 minutes.</p>`,
    });

    return { message: 'If an account exists with this email, a new verification code has been sent.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashingService.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, { email: user.email }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        onboarded: user.onboarded,
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal if user exists for security
      return { message: 'If an account exists with this email, a reset link will be sent.' };
    }

    const resetToken = this.utilsService.generateOTP(); // or a random string
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 15);

    await this.userService.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    await this.mailerService.sendResendMail({
      email: user.email,
      subject: 'Reset your password - OneNigeria',
      html: `<p>Your password reset code is: <b>${resetToken}</b></p>`,
    });

    return { message: 'If an account exists with this email, a reset link will be sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByResetToken(resetPasswordDto.token);
    if (!user || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashingService.hash(resetPasswordDto.newPassword);
    await this.userService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { message: 'Password reset successful' };
  }

  async onboard(userId: string, onboardingDto: OnboardingDto) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.userService.update(userId, {
      avatar: onboardingDto.avatar,
      fullname: onboardingDto.fullname,
      username: onboardingDto.username,
      phone1: onboardingDto.phone1,
      phone2: onboardingDto.phone2,
      dob: new Date(onboardingDto.dob),
      ward: onboardingDto.ward,
      pollingUnit: onboardingDto.pollingUnit,
      neighborhood: onboardingDto.neighborhood,
      nationIssueMaterials: onboardingDto.interests,
      onboarded: true,
    });

    return { message: 'Onboarding successful' };
  }

  async getMe(userId: string) {
    const user = await this.userService.findById(userId);
    const { password, otp, otpExpiry, resetToken, resetTokenExpiry, ...result } = user;
    return result;
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
