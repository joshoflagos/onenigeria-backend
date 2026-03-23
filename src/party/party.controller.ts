import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { PartyService } from './party.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Controller('parties')
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreatePartyDto) {
    return this.partyService.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.partyService.findAll();
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partyService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartyDto) {
    return this.partyService.update(id, dto);
  }

  // SEARCH
  @Get('search/query')
  search(@Query('q') q: string) {
    return this.partyService.search(q);
  }
}
