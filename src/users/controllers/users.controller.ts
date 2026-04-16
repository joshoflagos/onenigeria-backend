import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import {
  CurrentIdentity,
  WhoamiAuthGuard,
} from '@odysseon/whoami-adapter-nestjs';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { OnboardingDto } from '../dto/onboarding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('onenigeria/user')
@UseGuards(WhoamiAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('onboarding')
  async onboard(
    @CurrentIdentity('accountId') accountId: string,
    @Body() dto: OnboardingDto,
  ) {
    return this.userService.onboard(accountId, dto);
  }

  @Get('profile')
  async getProfile(@CurrentIdentity('accountId') accountId: string) {
    return this.userService.findById(accountId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentIdentity('accountId') accountId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(accountId, dto);
  }
}
