import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class OnboardingDto {
  @ApiProperty({ example: 'uuid-of-the-user' })
  @IsUUID()
  userId: string;
  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Adebayo Chukwuma Jubril' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: '+2347051459134' })
  @IsString()
  phone1: string;

  @ApiProperty({ example: '+2348132087839', required: false })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiProperty({ example: '1995-10-15' })
  @IsDateString()
  dob: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  ward: string;

  @ApiProperty({ example: 'Ikeja' })
  @IsString()
  pollingUnit: string;

  @ApiProperty({ example: 'Magodo Estate Phase II' })
  @IsString()
  neighborhood: string;

  @ApiProperty({ example: ['Education', 'Healthcare'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  interests: string[];
}
