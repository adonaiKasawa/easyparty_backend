import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { UpdateReservationDto } from "./reservation.dto";

export class CreatePaiementDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  montant_total_paiement: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  montant_suggerer_paiement: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  montant_paye_paiement: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mode_paiement: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference_paiement: string;


}
export class PaiementDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  paeiment: CreatePaiementDto

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  reservation: UpdateReservationDto

}

export class UpdatePaiementDto extends PartialType(CreatePaiementDto) { }