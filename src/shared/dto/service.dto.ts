import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  person: boolean

}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
