import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class authDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(undefined, {
    message: "Le numéro de téléphone n'est pas valide",
  })
  telephone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;
}

export class authUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  telephone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
