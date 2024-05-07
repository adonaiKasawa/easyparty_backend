import { Column, Entity, ManyToOne } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { UserEntity } from "./user.entity";
import { ReservationEntity } from "./reservation.entity";
import { ServiceEntity } from "./service.entity";

@Entity('reservation_services')
export class ReservationServiceEntity extends TimesTampInterface {

  @ManyToOne(
    (type) => ReservationEntity,
    (u) => u.res_serv,
    {
      cascade: ["insert", "update", "remove"]
    }
  )
  reservation: ReservationEntity

  @ManyToOne(
    (type) => ServiceEntity,
    (u) => u.res_serv,
    {
      cascade: ["insert", "update", "remove"],
      eager: true
    }
  )
  service: ServiceEntity
}
