import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Party } from './entities/party.entity';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(Party)
    private readonly partyRepo: Repository<Party>,
  ) {}

  create(dto: CreatePartyDto) {
    const party = this.partyRepo.create({
      ...dto,
      founded: new Date(dto.founded),
    });
    return this.partyRepo.save(party);
  }

  findAll() {
    return this.partyRepo.find();
  }

  async findOne(id: string) {
    const party = await this.partyRepo.findOne({ where: { id } });
    if (!party) throw new NotFoundException('Party not found');
    return party;
  }

  async update(id: string, dto: UpdatePartyDto) {
    await this.findOne(id);
    await this.partyRepo.update(id, dto);
    return this.findOne(id);
  }

  search(query: string) {
    return this.partyRepo.find({
      where: [
        { name: Like(`%${query}%`) },
        { acronym: Like(`%${query}%`) },
        { slogan: Like(`%${query}%`) },
      ],
    });
  }
}
