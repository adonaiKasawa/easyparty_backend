import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { RepositoryService } from '../repository/repository.service';
import { RepositoryModule } from '../repository/repository.module';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [RepositoryModule, ReservationModule],
  controllers: [PaiementController],
  providers: [PaiementService],
  exports: [PaiementService]
})
export class PaiementModule { }
