import { Column, Entity } from "typeorm";
import { TimesTampInterface } from "./timesTamp";

@Entity('paiement')
export class PaiementEntity extends TimesTampInterface {

  @Column()
  montant_abonnement: string;

  @Column()
  method_abonnement: string;

  @Column()
  reference_abonnement: string;

}

