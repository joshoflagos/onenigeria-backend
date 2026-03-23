import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OneNigeriaUser } from './entities/user.entity';
import { OnboardingDto } from './dto/onboarding.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(OneNigeriaUser)
    private readonly userRepository: Repository<OneNigeriaUser>,
  ) {}

  async findById(id: string): Promise<OneNigeriaUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<OneNigeriaUser> {
    return await this.userRepository.findOneBy({ email: email.toLowerCase() });
  }

  async findByResetToken(token: string): Promise<OneNigeriaUser> {
    return await this.userRepository.findOneBy({ resetToken: token });
  }

  async create(data: Partial<OneNigeriaUser>): Promise<OneNigeriaUser> {
    if (data.email) {
      data.email = data.email.toLowerCase();
    }
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async update(id: string, data: Partial<OneNigeriaUser>): Promise<OneNigeriaUser> {
    await this.findById(id);
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async onboard(userId: string, onboardingDto: OnboardingDto): Promise<OneNigeriaUser> {
    return await this.update(userId, {
      ...onboardingDto,
      dob: new Date(onboardingDto.dob),
      onboarded: true,
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<OneNigeriaUser> {
    const updateData: any = { ...updateProfileDto };
    if (updateProfileDto.dob) {
      updateData.dob = new Date(updateProfileDto.dob);
    }
    return await this.update(userId, updateData);
  }
}
