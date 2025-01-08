import { IsDate, IsInt, IsOptional, Max, Min } from 'class-validator';

export class PeriodDto {
  @IsInt()
  @IsOptional()
  @Max(44)
  @Min(1)
  avgCycleLength: number = 28;

  @IsDate()
  startDateOfLastPeriod: Date;

  @IsInt()
  @IsOptional() // if this property is not always required
  durationOfLastPeriod?: number = 5;

  @IsInt()
  @IsOptional() // if this property is not always required
  upComingMonth?: number = 2;
}
