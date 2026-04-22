import { Injectable, NotFoundException } from '@nestjs/common';
import { OnboardingDto } from '../dto/onboarding.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma.service';
import { SendWelcomeEmailUseCase } from '../../mailer/usecases/send-welcome-mail.usecase';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly sendWelcomeEmail: SendWelcomeEmailUseCase,
  ) {}

  async findById(accountId: string) {
    const user = await this.prisma.oneNigeriaUser.findUnique({
      where: { accountId },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }

  async onboard(accountId: string, dto: OnboardingDto) {
    const data = {
      ...dto,
      dob: new Date(dto.dob),
      onboarded: true,
    };

    const user = await this.prisma.oneNigeriaUser.upsert({
      where: { accountId },
      create: {
        accountId,
        ...data,
      },
      update: data,
    });

    // Get account email for welcome email
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (account) {
      await this.sendWelcomeEmail.execute(
        account.email,
        user.fullname || 'Supporter',
      );
    }

    return user;
  }

  async updateProfile(accountId: string, dto: UpdateProfileDto) {
    const updateData: Prisma.OneNigeriaUserUpdateInput = {
      ...dto,
    };

    if (dto.dob) {
      updateData.dob = new Date(dto.dob);
    }

    try {
      return await this.prisma.oneNigeriaUser.update({
        where: { accountId },
        data: updateData,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User profile not found');
      }
      throw error;
    }
  }
}
