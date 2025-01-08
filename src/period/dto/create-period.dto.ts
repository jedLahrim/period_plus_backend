import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreatePeriodDto {
  @IsArray()
  @IsDateString({}, { each: true }) // Validates each element in the array as a date string
  @IsNotEmpty()
  periodDays: Date[];

  @IsInt()
  @IsNotEmpty()
  periodMonth: number;

  @IsArray()
  @IsDateString({}, { each: true })
  @IsOptional()
  ovulationDays: Date[];
}
