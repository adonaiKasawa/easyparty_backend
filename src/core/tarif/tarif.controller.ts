import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TarifService } from './tarif.service';
import { CreateTarifDto, UpdateTarifDto } from 'src/shared/dto/tarif.dto';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { User } from 'src/auth/user/user.decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tarif')
@ApiBearerAuth()
@Controller('tarif')
export class TarifController {
  constructor(private readonly tarifService: TarifService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createTarifDto: CreateTarifDto,
    @User() user: PayloadUserInterface
  ) {
    return this.tarifService.create(createTarifDto, user);
  }

  @Get()
  findAll() {
    return this.tarifService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tarifService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTarifDto: UpdateTarifDto) {
    return this.tarifService.update(+id, updateTarifDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarifService.delete(id);
  }
}
