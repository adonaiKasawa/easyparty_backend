import { Column, Entity, ManyToOne } from "typeorm";
import { TimesTampInterface } from "./timesTamp";
import { ReservationEntity } from "./reservation.entity";

@Entity('paiement')
export class PaiementEntity extends TimesTampInterface {

  @Column()
  montant_total_paiement: number;

  @Column()
  montant_suggerer_paiement: number;

  @Column()
  montant_paye_paiement: number;

  @Column()
  mode_paiement: string;

  @Column()
  reference_paiement: string;

  @ManyToOne(
    (type) => ReservationEntity,
    (r) => r.paiement,
    {
      cascade: ['insert', 'update'],
      nullable: true,
      eager: true
    }
  )
  reservation: ReservationEntity;
}

