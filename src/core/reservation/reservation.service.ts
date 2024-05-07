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
import { ReservationEntity } from 'src/shared/entities/reservation.entity';

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
      relations: ["user", "rooms", "rooms.tarif", "res_serv"],
      order: {
        id: "DESC"
      }
    });
  }

  findByUserId(id: number) {
    return this.repository.ReservationEntityRepository.find({
      where: { user: { id } },
      relations: ["rooms", "rooms.tarif"],
      order: {
        id: "DESC"
      }
    })
  }

  async findById(id: number) {
    try {
      return await this.repository.ReservationEntityRepository.findOne({
        where: {
          id
        },
        relations: ["rooms", "rooms.tarif", "user", "res_serv", "res_serv.service"]
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      console.log(updateReservationDto);

      const preload = await this.repository.ReservationEntityRepository.preload({ id, ...updateReservationDto })
      const res = await this.repository.ReservationEntityRepository.findOne({ where: { id }, relations: ["rooms"] })
      const rooms = await this.repository.RoomEntityRepository.findOne({
        where: { id: updateReservationDto.roomId ? updateReservationDto.roomId : res.rooms.id },
        relations: ["tarif"]
      });
      if (!rooms) new NotFoundException("La salle n'existe pas")
      if (updateReservationDto.date_start || updateReservationDto.date_end || updateReservationDto.roomId) {
        const reservation = await this.repository.ReservationEntityRepository.findOne({
          where: {
            date_start: LessThanOrEqual(updateReservationDto.date_end),
            date_end: MoreThanOrEqual(updateReservationDto.date_start),
            rooms: { id: rooms.id },
            user: { id: Not(updateReservationDto.clientId) }
          },
        });
        if (reservation) throw new NotFoundException("La sale n'est pas disponible pour cette date");
        preload.rooms = rooms
      }
      preload.niveau_reservation = updateReservationDto.niveau_reservation
      if (updateReservationDto.reservice) {
        console.log(updateReservationDto.reservice);

        const res_serv = await this.repository.ResServEntityRepository.find({
          where: {
            reservation: { id }
          }, relations: ["reservation"]
        })
        await this.repository.ResServEntityRepository.remove(res_serv)

        for (let i = 0; i < updateReservationDto.reservice.length; i++) {
          console.log("reservation", id);

          const e = updateReservationDto.reservice[i];
          const services = await this.repository.ServicesEntityRepository.findOneBy({ id: e });
          const cs = this.repository.ResServEntityRepository.create({});
          cs.service = services;
          cs.reservation = await this.repository.ReservationEntityRepository.findOneBy({ id });
          await this.repository.ResServEntityRepository.save(cs);
        }
      }

      const update = await this.repository.ReservationEntityRepository.save(preload)
      return update
    } catch (error) {
      console.log(error);

      throw new NotFoundException(error.message)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
