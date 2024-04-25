import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { RoomEntity } from "./room.entity";
import { UserEntity } from "./user.entity";
import { PaiementEntity } from "./paiement.entity";
import { ReservationServiceEntity } from "./reservation.service.entity";

@Entity('reservation')
export class ReservationEntity extends TimesTampInterface {

  @Column()
  date_start: Date

  @Column()
  date_end: Date

  @Column()
  number_person: number;

  @Column()
  status: string

  @ManyToOne(
    (type) => RoomEntity,
    (roomEntity) => roomEntity.reservation,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    }
  )
  rooms: RoomEntity;

  @OneToMany(
    (type) => PaiementEntity,
    (p) => p.reservation,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    })
  paiement: PaiementEntity[];

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.reservation,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    }
  )
  user: UserEntity;

  @OneToMany(
    (type) => ReservationServiceEntity,
    (ser) => ser.reservation,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  res_serv: ReservationServiceEntity[];

}
