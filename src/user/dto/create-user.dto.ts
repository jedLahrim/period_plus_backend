import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @IsInt()
  @Min(1)
  avgCycleLength: number = 28; // Default: 28

  @IsDate()
  @IsOptional()
  startDateOfLastPeriod: Date;

  @IsInt()
  @Min(1)
  durationOfLastPeriod: number = 5; // Default: 5

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  dailyMeditation?: boolean;
  
  @IsString()
  @IsOptional()
  workoutAlert?: boolean;

  @IsString()
  @IsOptional()
  hydrationReminder?: boolean;

  @IsString()
  @IsOptional()
  enableAccountSettings?: boolean;

  @IsString()
  @IsOptional()
  privateAccount?: boolean;
}
