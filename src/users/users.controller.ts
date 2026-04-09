import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentIdentity, WhoamiAuthGuard } from '@odysseon/whoami-adapter-nestjs';

@Controller('onenigeria/user')
@UseGuards(WhoamiAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('onboarding')
  async onboard(@CurrentIdentity('accountId') accountId: string, @Body() dto: OnboardingDto) {
    return this.userService.onboard(accountId, dto);
  }

  @Get('profile')
  async getProfile(@CurrentIdentity('accountId') accountId: string) {
    return this.userService.findById(accountId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentIdentity('accountId') accountId: string,
    @Body() dto: UpdateProfileDto
  ) {
    return this.userService.updateProfile(
      accountId
      , dto
    );
  }
}
