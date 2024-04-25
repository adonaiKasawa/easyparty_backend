import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNumber, IsString } from "class-validator";

export class CreateReservationDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date_start: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date_end: Date;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  clientId: number

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  number_person: number

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  reservice: number[];
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty()
  @IsString()
  status: string
}
