import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/shared/entities/user.entity';
import { RoomEntity } from 'src/shared/entities/room.entity';
import { TarifEntity } from 'src/shared/entities/tarif.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoomEntity,
      TarifEntity
    ])
  ],
  providers: [RepositoryService],
  exports: [RepositoryService]
})
export class RepositoryModule { }
