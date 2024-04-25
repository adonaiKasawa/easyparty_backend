import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrivilegesEnum } from '../enums/privilege.enum';
import { TimesTampInterface } from './timesTamp';
import { RoomEntity } from './room.entity';
import { TarifEntity } from './tarif.entity';
import { ReservationEntity } from './reservation.entity';
import { ServiceEntity } from './service.entity';

@Entity('users')
export class UserEntity extends TimesTampInterface {
  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  telephone: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  sexe: string;

  @Column({ nullable: true })
  datenaissance: Date;

  @Column({ nullable: true })
  adresse: string;

  @Column({ nullable: true })
  ville: string;

  @Column({ nullable: true })
  pays: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  salt: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  hashedRt: string;

  @Column({ default: PrivilegesEnum.CLT })
  privilege: string;

  @Column({ default: 'actif' })
  status: string;

  @Column({ default: false })
  confirm: boolean;

  @OneToMany(
    (type) => RoomEntity,
    (roomEntity) => roomEntity.user,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  rooms: RoomEntity[];

  @OneToMany(
    (type) => TarifEntity,
    (tarifEntity) => tarifEntity.user,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  tarifs: TarifEntity[];

  @OneToMany(
    (type) => ReservationEntity,
    (reservation) => reservation.user,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  reservation: ReservationEntity[];

  @OneToMany(
    (type) => ServiceEntity,
    (ser) => ser.users,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  services: ServiceEntity[];

}
