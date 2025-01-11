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
  IsBooleanString,
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

  @IsBooleanString()
  @IsOptional()
  dailyMeditation?: boolean;
  
  @IsBooleanString()
  @IsOptional()
  workoutAlert?: boolean;

  @IsBooleanString()
  @IsOptional()
  hydrationReminder?: boolean;

  @IsBooleanString()
  @IsOptional()
  enableAccountSettings?: boolean;

  @IsBooleanString()
  @IsOptional()
  privateAccount?: boolean;
}
