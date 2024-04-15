import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTarifDto, UpdateTarifDto } from 'src/shared/dto/tarif.dto';
import { TarifEntity } from 'src/shared/entities/tarif.entity';
import { RepositoryService } from '../repository/repository.service';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';

@Injectable()
export class TarifService {
  constructor(
    private repositoryService: RepositoryService
  ) { }

  async create(tariff: CreateTarifDto, user: PayloadUserInterface): Promise<TarifEntity> {
    try {
      const create = this.repositoryService.TarifEntityRepository.create(tariff);
      const owner = await this.repositoryService.UserEntityRepository.findOneBy({id: user.sub});
      if (!owner) throw new NotFoundException("L'utilisateur n'existe pas!")
      create.user = owner
      return await this.repositoryService.TarifEntityRepository.save(create);
    } catch (error) {
      console.log(error.message);
      
      throw new NotFoundException(error.message);
    }
  }

  async findAll(): Promise<TarifEntity[]> {
    return await this.repositoryService.TarifEntityRepository.find();
  }

  async findById(id: number): Promise<TarifEntity> {
    return await this.repositoryService.TarifEntityRepository.findOneBy({ id });
  }

  async update(id: number, updatedTariff: UpdateTarifDto): Promise<TarifEntity> {
    await this.repositoryService.TarifEntityRepository.update(id, updatedTariff);
    return await this.repositoryService.TarifEntityRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repositoryService.TarifEntityRepository.delete(id);
  }
}
