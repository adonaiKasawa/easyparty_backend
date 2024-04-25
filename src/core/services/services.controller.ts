import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from '../../shared/dto/service.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { User } from 'src/auth/user/user.decorators';


@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @User() user: PayloadUserInterface
  ) {
    return this.servicesService.create(createServiceDto, user);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('/owner/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return await this.servicesService.findByOwner(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number,) {
    return this.servicesService.remove(id);
  }
}
