import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { CreatePaiementDto, UpdatePaiementDto } from 'src/shared/dto/paiement.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Paiement')
@Controller('paiement')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  create(@Body() createPaiementDto: CreatePaiementDto) {
    return this.paiementService.create(createPaiementDto);
  }

  @Get()
  findAll() {
    return this.paiementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaiementDto: UpdatePaiementDto) {
    return this.paiementService.update(+id, updatePaiementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paiementService.remove(+id);
  }
}
