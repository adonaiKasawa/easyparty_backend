import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto, UpdateServiceDto } from '../../shared/dto/service.dto';
import { RepositoryService } from '../repository/repository.service';
import { ServiceEntity } from 'src/shared/entities/service.entity';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';

@Injectable()
export class ServicesService {
  constructor(
    private readonly repository: RepositoryService,
  ) { }

  async findAll(): Promise<ServiceEntity[]> {
    return this.repository.ServicesEntityRepository.find();
  }

  async findByOwner(id: number): Promise<ServiceEntity[]> {
    return this.repository.ServicesEntityRepository.find({
      where: {users: {id}},
      relations: ["users"]
    });
  }

  async create(serviceData: CreateServiceDto, user: PayloadUserInterface): Promise<ServiceEntity> {
    try {
      const service = this.repository.ServicesEntityRepository.create(serviceData);
      service.users = await this.repository.UserEntityRepository.findOneBy({ id: user.sub });
      return await this.repository.ServicesEntityRepository.save(service);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: number, serviceData: UpdateServiceDto): Promise<ServiceEntity> {
    await this.repository.ServicesEntityRepository.update(id, serviceData);
    return this.repository.ServicesEntityRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.repository.ServicesEntityRepository.delete(id);
  }
}
