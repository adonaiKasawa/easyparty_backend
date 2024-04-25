import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { UserEntity } from "./user.entity";
import { ReservationServiceEntity } from "./reservation.service.entity";

@Entity('services')
export class ServiceEntity extends TimesTampInterface {
  @Column()
  name: string;

  @Column('text',{ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column()
  person: boolean;

  @ManyToOne(
    (type) => UserEntity,
    (u) => u.services,
    {
      cascade: ["insert", "update", "remove"]
    }
  )
  users: UserEntity;

  @OneToMany(
    (type) => ReservationServiceEntity,
    (ser) => ser.service,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    },
  )
  res_serv: ReservationServiceEntity[];
}
