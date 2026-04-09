import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class PartiesService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreatePartyDto) {
    return this.prisma.party.create({
      data: {
        ...dto,
        founded: dto.founded ? new Date(dto.founded) : null,
      },
    });
  }

  findAll() {
    return this.prisma.party.findMany();
  }

  async findOne(id: string) {
    const party = await this.prisma.party.findUnique({
      where: { id },
    });
    if (!party) {
      throw new NotFoundException('Party not found');
    }
    return party;
  }

  async update(id: string, dto: UpdatePartyDto) {
    const updateData: Prisma.PartyUpdateInput = { ...dto };

    if (dto.founded) {
      updateData.founded = new Date(dto.founded);
    }

    try {
      return await this.prisma.party.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Party not found');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.party.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Party not found');
      }
      throw error;
    }
  }

  search(query: string) {
    return this.prisma.party.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { acronym: { contains: query, mode: 'insensitive' } },
          { slogan: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
}
