import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) { }

  @Post()
  create(@Body() dto: CreatePartyDto) {
    return this.partiesService.create(dto);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.partiesService.search(q);
  }

  @Get()
  findAll() {
    return this.partiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePartyDto) {
    return this.partiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partiesService.remove(id);
  }
}
