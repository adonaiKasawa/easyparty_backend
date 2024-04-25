import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaiementDto, PaiementDto, UpdatePaiementDto } from 'src/shared/dto/paiement.dto';
import { RepositoryService } from '../repository/repository.service';
import { PaiementEntity } from 'src/shared/entities/paiement.entity';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class PaiementService {
  constructor(
    private repository: RepositoryService,
    private reservationService: ReservationService
  ) { }

  async create(id: number, createPaiementDto: PaiementDto): Promise<PaiementEntity> {
    try {
      const create = this.repository.PaiementEntityRepository.create(createPaiementDto.paeiment)
      create.reservation = await this.repository.ReservationEntityRepository.findOne({ where: { id } });
      // const update = await this.reservationService.update(id, createPaiementDto.reservation);
      return await this.repository.PaiementEntityRepository.save(create);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Une ereur se produit lors de la validation du payement')
    }
  }

  findByUserId(id: number) {
    try {
      return this.repository.PaiementEntityRepository.find({
        where: {
          reservation: {
            user: { id }
          }
        },
        relations: ["reservation", "reservation.user"]
      })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  findByOwnerId(id: number) {
    try {
      return this.repository.PaiementEntityRepository.find({
        where: {
          reservation: {
            rooms: { user: {id} }
          }
        },
        relations: ["reservation", "reservation.user"]
      })
    } catch (error) {
      throw new NotFoundException()
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} paiement`;
  }

  update(id: number, updatePaiementDto: UpdatePaiementDto) {
    return `This action updates a #${id} paiement`;
  }

  remove(id: number) {
    return `This action removes a #${id} paiement`;
  }
}
