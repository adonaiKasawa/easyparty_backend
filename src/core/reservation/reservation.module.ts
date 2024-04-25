import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { RepositoryModule } from '../repository/repository.module';
import { PaiementModule } from '../paiement/paiement.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService]
})
export class ReservationModule {}
