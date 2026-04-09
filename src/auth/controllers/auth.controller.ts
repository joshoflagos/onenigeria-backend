import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Public,
  AUTH_METHODS,
} from '@odysseon/whoami-adapter-nestjs';
import type { AuthMethods, Receipt } from '@odysseon/whoami-core';
import type { Request, Response } from 'express';
import { LoginDto, RegisterDto, TokenResponseDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_METHODS) private readonly auth: AuthMethods,
  ) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register with email + password' })
  async register(@Body() dto: RegisterDto): Promise<TokenResponseDto> {
    const receipt = await this.auth.registerWithPassword!({
      email: dto.email,
      password: dto.password,
    });
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
  async googleCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    const receipt = req.user as Receipt;
    res.json({ token: receipt.token });
  }
}
