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
  @IsOptional()
  avgCycleLength: number;

  @IsDate()
  @IsOptional()
  startDateOfLastPeriod: Date;

  @IsInt()
  @Min(1)
  @IsOptional()
  durationOfLastPeriod: number;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsOptional()
  dailyMeditation?: boolean;
  
  @IsOptional()
  workoutAlert?: boolean;

  @IsOptional()
  hydrationReminder?: boolean;

  @IsOptional()
  enableAccountSettings?: boolean;

  @IsOptional()
  privateAccount?: boolean;
}
