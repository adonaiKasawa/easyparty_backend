import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { RepositoryService } from '../repository/repository.service';

@Module({
  imports: [RepositoryService],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule { }
