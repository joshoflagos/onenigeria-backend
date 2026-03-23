import { Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AccessTokenGuard } from '../../iam/login/guards/access-token/access-token.guard';

@ApiTags('OneNigeria User')
@Controller('onenigeria/user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('onboarding')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete user onboarding' })
  @ApiResponse({ status: 200, description: 'Onboarding successful' })
  async onboard(@Request() req, @Body() onboardingDto: OnboardingDto) {
    return await this.userService.onboard(req.user.sub, onboardingDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@Request() req) {
    return await this.userService.findById(req.user.sub);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.userService.updateProfile(req.user.sub, updateProfileDto);
  }
}
