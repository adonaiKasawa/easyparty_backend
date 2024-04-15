import { Column, Entity, ManyToOne } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { RoomEntity } from "./room.entity";
import { UserEntity } from "./user.entity";

@Entity('reservation')
export class ReservationEntity extends TimesTampInterface {

  @Column()
  date_r: Date

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

  @ManyToOne(
    (type) => UserEntity,
    (user) => user.reservation,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    }
  )
  user: UserEntity;
  
}
