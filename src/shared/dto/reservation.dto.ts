import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber } from "class-validator";

export class CreateReservationDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date_r: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  roomId: number;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
