import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, UseGuards, NotFoundException, Query, ParseIntPipe } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from 'src/shared/dto/room.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoomEntity } from 'src/shared/entities/room.entity';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import Path = require('path');
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { User } from 'src/auth/user/user.decorators';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RepositoryService } from '../repository/repository.service';
import { ApiConfig } from 'src/configs/api.config';

export const storage = (folders: string) => ({
  storage: diskStorage({
    destination: `src/uploads/${folders}`,
    filename: (req, file: Express.Multer.File, cb) => {
      const filename: string = `easyparty-${folders}-` + randomUUID();
      const extension: string = Path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
});

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly repositoryService: RepositoryService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 15 }], storage('rooms')))
  async createRoom(
    @Body() roomDto: CreateRoomDto,
    @User() user: PayloadUserInterface,
    @UploadedFiles() files: { files: Express.Multer.File[] },
  ): Promise<RoomEntity> {
    if (this.repositoryService.checkPrivileges(user)) {
      const filesName: string[] = [];
      files.files.map((items) => { filesName.push(items.filename) })
      return await this.roomsService.createRoom(roomDto, filesName, user);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("assignTarif/:roomId/:tarifId/")
  async assignTariff(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('tarifId', ParseIntPipe) tarifId: number,
    @User() user: PayloadUserInterface
  ): Promise<RoomEntity> {
    if (this.repositoryService.checkPrivileges(user)) {
      return await this.roomsService.assignTariff(roomId, tarifId, user);
    }
  }
  
  @Get()
  async getAllRooms(): Promise<RoomEntity[]> {
    return await this.roomsService.getAllRooms();
  }

  @Get('paginated')
  async getRoomsPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.roomsService.getRoomsPaginated(
      {
        page: Number(page),
        limit: Number(limit),
        route: ApiConfig.url + `rooms/paginated`,
      },
    );
  }

  @Get('paginated/owner/:id')
  async getRoomByOwnerPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.roomsService.getRoomsByOwnerPaginated(
      {
        page: Number(page),
        limit: Number(limit),
        route: ApiConfig.url + `rooms/owner/paginated/${id}`,
      },
      id,
    );
  }

  @Get('owner/:id')
  async getRoomByOwnerId(@Param('id') id: number): Promise<RoomEntity[]> {
    return await this.roomsService.getRoomByOwnerId(id);
  }

  @Get(':id')
  async getRoomById(@Param('id') id: number): Promise<RoomEntity> {
    return await this.roomsService.getRoomById(id);
  }

  @Put(':id')
  async updateRoom(@Param('id') id: number, @Body() roomDto: CreateRoomDto): Promise<RoomEntity> {
    return await this.roomsService.updateRoom(id, roomDto);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: number): Promise<void> {
    return await this.roomsService.deleteRoom(id);
  }

}
