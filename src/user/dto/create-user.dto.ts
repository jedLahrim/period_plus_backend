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
  startDateOfLastPeriod: Date;

  @IsInt()
  @Min(1)
  durationOfLastPeriod: number = 5; // Default: 5

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsBoolean()
  dailyMeditation: boolean = false; // Default: false

  @IsBoolean()
  workoutAlert: boolean = false; // Default: false

  @IsBoolean()
  hydrationReminder: boolean = false; // Default: false

  @IsBoolean()
  enableAccountSettings: boolean = false; // Default: false

  @IsBoolean()
  privateAccount: boolean = false; // Default: false
}
