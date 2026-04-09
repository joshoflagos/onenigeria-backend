import { IsArray, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';

export class CreatePartyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  acronym: string;

  @IsNotEmpty()
  slogan: string;

  @IsDateString()
  founded: string;

  @IsNotEmpty()
  founder: string;

  @IsNotEmpty()
  currentChair: string;

  @IsArray()
  chairContacts: string[];

  @IsBoolean()
  isActive: boolean;
}
