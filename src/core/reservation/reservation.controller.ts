import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto, UpdateReservationDto } from '../../shared/dto/reservation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { User } from 'src/auth/user/user.decorators';

@ApiTags('Reservation')
@ApiBearerAuth()
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @User() user: PayloadUserInterface
  ) {
    return this.reservationService.create(createReservationDto, user);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get('owner/:id')
  findByOwnerRoom(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.reservationService.findByOwnerRoom(id);
  }
  @Get('byId/:id')
  findById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.reservationService.findById(id);
  }

  @Get(':id')
  findByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationDto: UpdateReservationDto,
    @User() user: PayloadUserInterface
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
