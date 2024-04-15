import { Module } from '@nestjs/common';
import { TarifService } from './tarif.service';
import { TarifController } from './tarif.controller';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [TarifController],
  providers: [TarifService],
})
export class TarifModule { }
