import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class OnboardingDto {
  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: '+2348000000000' })
  @IsString()
  phone1: string;

  @ApiProperty({ example: '+2348100000000', required: false })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  dob: string;

  @ApiProperty({ example: 'Ward A' })
  @IsString()
  ward: string;

  @ApiProperty({ example: 'PU 001' })
  @IsString()
  pollingUnit: string;

  @ApiProperty({ example: 'Central Neighborhood' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: ['Material 1', 'Material 2'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  nationIssueMaterials: string[];
}
