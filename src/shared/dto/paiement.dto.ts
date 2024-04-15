import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreatePaiementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  montant_abonnement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  method_abonnement: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference_abonnement: string;
}


export class UpdatePaiementDto extends PartialType(CreatePaiementDto) { }