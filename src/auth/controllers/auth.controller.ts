import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@odysseon/whoami-adapter-nestjs';
import {
  AuthenticateWithPasswordUseCase,
  Receipt,
  RegisterWithPasswordUseCase,
} from '@odysseon/whoami-core';
import type { Request, Response } from 'express';
import { LoginDto, RegisterDto, TokenResponseDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerWithPassword: RegisterWithPasswordUseCase,
    private readonly authenticateWithPassword: AuthenticateWithPasswordUseCase,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register with email + password' })
  async register(@Body() dto: RegisterDto): Promise<TokenResponseDto> {
    const receipt = await this.registerWithPassword.execute({
      email: dto.email,
      password: dto.password,
    });
    return { token: receipt.token };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email + password' })
  async login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    const receipt = await this.authenticateWithPassword.execute({
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
  googleCallback(@Req() req: Request, @Res() res: Response): void {
    const receipt = req.user as Receipt;
    res.json({ token: receipt.token });
  }
}
