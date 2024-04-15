import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto, UpdateReservationDto } from '../../shared/dto/reservation.dto';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { RepositoryService } from '../repository/repository.service';
import { ReservationStatusEnum } from 'src/shared/enums/reservation.enum';

@Injectable()
export class ReservationService {
  constructor(
    private repository: RepositoryService
  ) { }

  async create(createReservationDto: CreateReservationDto, user: PayloadUserInterface) {
    try {
      const create = this.repository.ReservationEntityRepository.create(createReservationDto);
      const client = await this.repository.UserEntityRepository.findOneBy({ id: user.sub });
      if (!client) throw new NotFoundException("Le client n'existe pas.");
      const room = await this.repository.RoomEntityRepository.findOneBy({ id: createReservationDto.roomId });
      if (!room) throw new NotFoundException("La salle de fete n'existe pas.");
      const reservation = await this.repository.ReservationEntityRepository.findOneBy({ date_r: createReservationDto.date_r, rooms: { id: room.id } })
      if (reservation) throw new NotFoundException("La sale n'est pas disponible pour cette date");
      create.status = ReservationStatusEnum.P;
      create.user = client;
      return await this.repository.ReservationEntityRepository.save(create);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAll() {
    return await this.repository.ReservationEntityRepository.find()
  }

  findByOwnerRoom(id: number) {
    return this.repository.ReservationEntityRepository.find({
      where: { rooms: { user: { id } } },
      relations: ["user", "rooms", "rooms.user"]
    });
  }

  findByUserId(id: number) {
    return this.repository.ReservationEntityRepository.find({
      where: { user: { id } },
      relations: ["user"]
    })
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
