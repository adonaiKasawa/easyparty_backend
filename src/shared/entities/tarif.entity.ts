import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { UserEntity } from "./user.entity";
import { RoomEntity } from "./room.entity";

@Entity('tarif')
export class TarifEntity extends TimesTampInterface {

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(
    (type) => UserEntity,
    (userEntity) => userEntity.tarifs,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  user: UserEntity

  @OneToMany(
    (type) => RoomEntity,
    (roomEntity) => roomEntity.tarif,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },)
  rooms: RoomEntity[];
}
