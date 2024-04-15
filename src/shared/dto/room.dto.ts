import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  capacity: number;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  adress: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  equipment?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  additional_services?: string[];

}


export class UpdateRoomDto extends PartialType(CreateRoomDto) { }