import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaiementEntity } from 'src/shared/entities/paiement.entity';
import { ReservationEntity } from 'src/shared/entities/reservation.entity';
import { ReservationServiceEntity } from 'src/shared/entities/reservation.service.entity';
import { RoomEntity } from 'src/shared/entities/room.entity';
import { ServiceEntity } from 'src/shared/entities/service.entity';
import { TarifEntity } from 'src/shared/entities/tarif.entity';
import { UserEntity } from 'src/shared/entities/user.entity';
import { PrivilegesEnum } from 'src/shared/enums/privilege.enum';
import { PayloadUserInterface } from 'src/shared/payload/payload.user.interface';
import { Repository } from 'typeorm';


@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    public UserEntityRepository: Repository<UserEntity>,
    @InjectRepository(RoomEntity)
    public RoomEntityRepository: Repository<RoomEntity>,
    @InjectRepository(TarifEntity)
    public TarifEntityRepository: Repository<TarifEntity>,
    @InjectRepository(ReservationEntity)
    public ReservationEntityRepository: Repository<ReservationEntity>,
    @InjectRepository(PaiementEntity)
    public PaiementEntityRepository: Repository<PaiementEntity>,
    @InjectRepository(ServiceEntity)
    public ServicesEntityRepository: Repository<ServiceEntity>,
    @InjectRepository(ReservationServiceEntity)
    public ResServEntityRepository: Repository<ReservationServiceEntity>,


  ) { }

  checkPrivileges(user: PayloadUserInterface) {
    if (user.privilege_user !== PrivilegesEnum.SAO && user.privilege_user !== PrivilegesEnum.PSF) {
      throw new UnauthorizedException();
    } else {
      return true
    }
  }


}
