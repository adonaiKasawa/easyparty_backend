import { Injectable } from '@nestjs/common';
import { CreatePaiementDto, UpdatePaiementDto } from 'src/shared/dto/paiement.dto';

@Injectable()
export class PaiementService {
  create(createPaiementDto: CreatePaiementDto) {
    return 'This action adds a new paiement';
  }

  findAll() {
    return `This action returns all paiement`;
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
