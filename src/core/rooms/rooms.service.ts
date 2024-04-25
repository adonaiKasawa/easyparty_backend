import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from 'src/shared/dto/room.dto';
import { RepositoryService } from '../repository/repository.service';
import { RoomEntity } from 'src/shared/entities/room.entity';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomsService {
  constructor(
    private readonly repository: RepositoryService,
  ) { }

  async createRoom(roomDto: CreateRoomDto, filenames: string[], user: PayloadUserInterface): Promise<RoomEntity> {
    const room = this.repository.RoomEntityRepository.create(roomDto);
    room.visuals = filenames
    const owner = await this.repository.UserEntityRepository.findOneBy({ id: user.sub });
    if (!owner) throw new NotFoundException("L'utilisateur n'existe pas!")
    room.user = owner
    return await this.repository.RoomEntityRepository.save(room);
  }

  async assignTariff(roomId: number, tarifId: number, user: PayloadUserInterface): Promise<RoomEntity> {
    const room = await this.repository.RoomEntityRepository.preload({ id: roomId });
    const tarif = await this.repository.TarifEntityRepository.findOne({ where: { id: tarifId, user: { id: user.sub } }, relations: ['user'] })
    if (!tarif) throw new NotFoundException("Le tarif n'existe pas !");
    room.tarif = tarif
    return await this.repository.RoomEntityRepository.save(room);
  }

  async getAllRooms(): Promise<RoomEntity[]> {
    return await this.repository.RoomEntityRepository.find();
  }

  async getRoomsPaginated(options: IPaginationOptions): Promise<Pagination<RoomEntity>> {
    return await paginate<RoomEntity>(this.repository.RoomEntityRepository, options, {
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  async getRoomsByOwnerPaginated(options: IPaginationOptions, id: number): Promise<Pagination<RoomEntity>> {
    return await paginate<RoomEntity>(this.repository.RoomEntityRepository, options, {
      where: { user: { id } },
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  async getRoomById(id: number): Promise<RoomEntity> {
    const room = await this.repository.RoomEntityRepository.findOne({ where: { id }, relations: ['tarif'] });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async getRoomByOwnerId(id: number): Promise<RoomEntity[]> {
    const room = await this.repository.RoomEntityRepository.find({
      where: { user: { id } },
      relations: ["user"]
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async updateRoom(id: number, roomDto: UpdateRoomDto): Promise<RoomEntity> {
    const room = await this.getRoomById(id);
    // Update only provided fields
    Object.assign(room, roomDto);
    return await this.repository.RoomEntityRepository.save(room);
  }

  async deleteRoom(id: number): Promise<void> {
    const room = await this.getRoomById(id);
    await this.repository.RoomEntityRepository.remove(room);
  }

}
