import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from './entities/period.entity';
import { UserModel } from '../user/entities/user.entity';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { randomUUID } from 'crypto';
@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
  ) {}

  // Create a new period
  async createPeriod(
    createPeriodDto: CreatePeriodDto,
    user: UserModel,
  ): Promise<Period> {
    try {
      const { periodDays, periodMonth } = createPeriodDto;

      if (!periodDays || !periodMonth) {
        rethrow(
          new BadRequestException(
            'Missing required fields: periodDays or periodMonth',
          ),
        );
      }

      const period = this.periodRepository.create({
        id: randomUUID(),
        ...createPeriodDto,
        user: { id: user.id },
      });

      return period;
    } catch (error) {
      throw new BadRequestException(
        'Failed to create period: ' + error.message,
      );
    }
  }

  // Get all periods for a specific user
  async getPeriodsByUser(userId: string): Promise<Period[]> {
    try {
      const periods = await this.periodRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }, // Optional: sort by most recent
      });

      if (!periods || periods.length === 0) {
        rethrow(new NotFoundException('No periods found for this user'));
      }

      return periods;
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch periods: ' + error.message,
      );
    }
  }

  // Get a specific period by ID
  async getPeriodById(id: string): Promise<Period> {
    try {
      const period = await this.periodRepository.findOne({ where: { id } });

      if (!period) {
        rethrow(new NotFoundException('Period not found'));
      }

      return period;
    } catch (error) {
      throw new BadRequestException('Failed to fetch period: ' + error.message);
    }
  }

  // Update a period
  async updatePeriod(
    id: string,
    updatePeriodDto: UpdatePeriodDto,
  ): Promise<Period> {
    try {
      const period = await this.getPeriodById(id);

      if (!period) {
        rethrow(new NotFoundException('Period not found'));
      }

      if (
        updatePeriodDto.periodDays &&
        !Array.isArray(updatePeriodDto.periodDays)
      ) {
        rethrow(
          new BadRequestException('periodDays must be an array of dates'),
        );
      }

      Object.assign(period, updatePeriodDto);

      return await this.periodRepository.save(period);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update period: ' + error.message,
      );
    }
  }

  // Delete a period
  async deletePeriod(id: string): Promise<void> {
    try {
      const result = await this.periodRepository.delete(id);

      if (result.affected === 0) {
        rethrow(new NotFoundException('Period not found'));
      }
    } catch (error) {
      throw new BadRequestException(
        'Failed to delete period: ' + error.message,
      );
    }
  }
}
