import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { CreatePaiementDto, PaiementDto, UpdatePaiementDto } from 'src/shared/dto/paiement.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';

@ApiTags('Paiement')
@ApiBearerAuth()
@Controller('paiement')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() paiementDto: PaiementDto,
  ) {
    return this.paiementService.create(id, paiementDto);
  }

  @Get('/owner/:id')
  findByOwnerId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paiementService.findByOwnerId(id);
  }

  
  @Get('/reservation/:id')
  findByUserId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paiementService.findByReservationId(id);
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
