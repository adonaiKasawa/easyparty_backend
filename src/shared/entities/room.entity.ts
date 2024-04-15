import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { UserEntity } from "./user.entity";
import { TarifEntity } from "./tarif.entity";
import { ReservationEntity } from "./reservation.entity";

@Entity('rooms')
export class RoomEntity extends TimesTampInterface {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  capacity: number

  @Column()
  location: string;

  @Column()
  adress: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column('simple-array', { nullable: true })
  equipment: string[];

  @Column('simple-array', { nullable: true })
  additional_services: string[];

  @Column('simple-array')
  visuals: string[];

  @ManyToOne(
    (type) => UserEntity,
    (userEntity) => userEntity.rooms,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  user: UserEntity

  @ManyToOne(
    (type) => TarifEntity,
    (tarifEntity) => tarifEntity.rooms,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  tarif: TarifEntity

  @OneToMany(
    (type) => ReservationEntity,
    (reservation) => reservation.rooms,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    }
  )
  reservation: ReservationEntity[];
}
