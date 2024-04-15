import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTarifDto {

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateTarifDto extends PartialType(CreateTarifDto) { }
