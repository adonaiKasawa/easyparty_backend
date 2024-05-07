import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsOptional, IsNotEmpty, IsPhoneNumber, IsEnum, IsEmail, IsBoolean } from "class-validator";
import { IsPasswordValid } from "./isvalidpassword.dto";
import { Type } from "class-transformer";
import { PrivilegesEnum } from "../enums/privilege.enum";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  nom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber(undefined, { message: "Le numéro de téléphone n'est pas valide" })
  telephone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: "L'adresse email n'est pas valide." })
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sexe: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  datenaissance: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  adresse: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ville: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  pays: string;

  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPasswordValid()
  // @Length(8, 255, {message: "Le mot de passe doit avoir au moins 8 caractèr"})
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PrivilegesEnum)
  privilege: PrivilegesEnum.CLT;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  confirm: boolean;

}


export class UpdateUserDto extends PartialType(CreateUserDto) { }