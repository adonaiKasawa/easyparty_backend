import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto, UpdateReservationDto } from '../../shared/dto/reservation.dto';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { RepositoryService } from '../repository/repository.service';
import { ReservationStatusEnum } from 'src/shared/enums/reservation.enum';
import { PaiementService } from '../paiement/paiement.service';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { randomUUID } from 'crypto';
import * as moment from 'moment';
import { LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    private repository: RepositoryService,
  ) { }

  async create(createReservationDto: CreateReservationDto, user: PayloadUserInterface) {
    try {
      const create = this.repository.ReservationEntityRepository.create(createReservationDto);
      const client = await this.repository.UserEntityRepository.findOneBy({ id: createReservationDto.clientId });
      if (!client) throw new NotFoundException("Le client n'existe pas.");
      const room = await this.repository.RoomEntityRepository.findOneBy({ id: createReservationDto.roomId });
      if (!room) throw new NotFoundException("La salle de fete n'existe pas.");
      const reservation = await this.repository.ReservationEntityRepository.findOneBy({
        date_start: LessThanOrEqual(createReservationDto.date_end),
        date_end: MoreThanOrEqual(createReservationDto.date_start),
        rooms: { id: room.id }
      })
      if (reservation) throw new NotFoundException("La sale n'est pas disponible pour cette date");
      create.status = ReservationStatusEnum.P;
      create.user = client;
      create.rooms = room;
      const save = await this.repository.ReservationEntityRepository.save(create);
      if (createReservationDto.reservice) {
        for (let i = 0; i < createReservationDto.reservice.length; i++) {
          const e = createReservationDto.reservice[i];
          const services = await this.repository.ServicesEntityRepository.findOneBy({ id: e })
          const cs = this.repository.ResServEntityRepository.create();
          cs.service = services;
          cs.reservation = save;
          await this.repository.ResServEntityRepository.save(cs)
        }
      }

      return save;

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
      relations: ["user", "rooms", "rooms.tarif"]
    });
  }

  findByUserId(id: number) {
    return this.repository.ReservationEntityRepository.find({
      where: { user: { id } },
      relations: ["rooms", "rooms.tarif"]
    })
  }

  async findById(id: number) {
    try {
      return await this.repository.ReservationEntityRepository.findOne({
        where: {
          id
        },
        relations: ["rooms", "rooms.tarif", "user", "res_serv", "res_serv.service"]
      })
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      const preload = await this.repository.ReservationEntityRepository.preload({ id, ...updateReservationDto })
      const res = await this.repository.ReservationEntityRepository.findOne({ where: { id }, relations: ["rooms"] })
      const rooms = await this.repository.RoomEntityRepository.findOne({
        where: { id: updateReservationDto.roomId ? updateReservationDto.roomId : res.rooms.id },
        relations: ["tarif"]
      });

      if (updateReservationDto.date_start || updateReservationDto.date_end || updateReservationDto.roomId) {
        const reservation = await this.repository.ReservationEntityRepository.findOneBy({
          date_start: updateReservationDto.date_start,
          date_end: updateReservationDto.date_start,
          rooms,
          user: {id: Not(updateReservationDto.clientId)}
        });
        if (reservation) throw new NotFoundException("La sale n'est pas disponible pour cette date");
        preload.rooms = rooms
      }
      if (updateReservationDto.reservice) {
        await this.repository.ResServEntityRepository.delete({
          reservation: {
            id
          }
        })

        for (let i = 0; i < updateReservationDto.reservice.length; i++) {
          const e = updateReservationDto.reservice[i];
          const services = await this.repository.ServicesEntityRepository.findOneBy({ id: e });
          const cs = this.repository.ResServEntityRepository.create();
          cs.service = services;
          cs.reservation = await this.repository.ReservationEntityRepository.findOneBy({ id });
          await this.repository.ResServEntityRepository.save(cs);
        }
      }
      return await this.repository.ReservationEntityRepository.save(preload);

    } catch (error) {
      console.log(error);

      throw new NotFoundException(error.message)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
