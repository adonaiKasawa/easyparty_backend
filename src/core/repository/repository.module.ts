import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/shared/entities/user.entity';
import { RoomEntity } from 'src/shared/entities/room.entity';
import { TarifEntity } from 'src/shared/entities/tarif.entity';
import { PaiementEntity } from 'src/shared/entities/paiement.entity';
import { ReservationEntity } from 'src/shared/entities/reservation.entity';
import { ServiceEntity } from 'src/shared/entities/service.entity';
import { ReservationServiceEntity } from 'src/shared/entities/reservation.service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoomEntity,
      TarifEntity,
      PaiementEntity,
      ReservationEntity,
      ServiceEntity,
      ReservationServiceEntity
    ])
  ],
  providers: [RepositoryService],
  exports: [RepositoryService]
})
export class RepositoryModule { }
