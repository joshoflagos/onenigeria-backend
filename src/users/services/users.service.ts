import { Injectable, NotFoundException } from '@nestjs/common';
import { OnboardingDto } from '../dto/onboarding.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

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

    return this.prisma.oneNigeriaUser.upsert({
      where: { accountId },
      create: {
        accountId,
        ...data,
      },
      update: data,
    });
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('User profile not found');
      }
      throw error;
    }
  }
}
