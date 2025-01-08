import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PeriodService } from './period.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { Period } from './entities/period.entity';
import { UserModel } from '../user/entities/user.entity';
import { GetUser } from '../user/get-user.decorator';
import { JwtAuthGuard } from '../user/guard/jwt-auth.guard';

@Controller('periods')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  // Create a new period
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPeriod(
    @Body() createPeriodDto: CreatePeriodDto,
    @GetUser() user: UserModel,
  ): Promise<Period> {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.periodService.createPeriod(createPeriodDto, user);
  }

  // Get all periods for a specific user
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getPeriodsByUser(@GetUser() user: UserModel): Promise<Period[]> {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.periodService.getPeriodsByUser(user.id);
  }

  // Get a specific period by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPeriodById(@Param('id') id: string): Promise<Period> {
    return this.periodService.getPeriodById(id);
  }

  // Update a period
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePeriod(
    @Param('id') id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ): Promise<Period> {
    return this.periodService.updatePeriod(id, updatePeriodDto);
  }

  // Delete a period
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePeriod(@Param('id') id: string): Promise<void> {
    return this.periodService.deletePeriod(id);
  }
}
