import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserModel } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import * as jwt from 'jsonwebtoken';
import { AttachmentService } from '../attachment/attachment.service';
import { PeriodDto } from './dto/period.dto';
import { calculatePeriodDates } from './lib/period';
import { PeriodService } from '../period/period.service';
import { ScaleData } from '../common/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    private attachmentService: AttachmentService,
    private periodService: PeriodService,
  ) {}

  // Create a new user (Register)
  async register(userData: CreateUserDto): Promise<UserModel> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Unique constraint violation
        throw new BadRequestException('Email is already exist');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Find user by email (for login)
  async findByEmail(email: string): Promise<UserModel> {
    try {
      return await this.userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  // Login
  async login(email: string, password: string): Promise<UserModel> {
    try {
      const user = await this.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        rethrow(new BadRequestException('Invalid credentials'));
      }
      if (!user) {
        rethrow(new NotFoundException('user not found'));
      }
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '15d',
        },
      );

      user.access = accessToken;
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid credentials');
    }
  }

  // Get user by ID
  async findById(id: string): Promise<UserModel> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Update user
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    profileImageFile: Express.Multer.File,
  ): Promise<UserModel> {
    try {
      await this.findById(id); // Ensure user exists
      let profileImageUrl: string;
      if (profileImageFile) {
        this.isImageFile(profileImageFile);
        profileImageUrl = await this.attachmentService.upload(profileImageFile);
      }
      updateUserDto.profileImageUrl ??= profileImageUrl;
      await this.userRepository.update(id, updateUserDto);
      return await this.findById(id); // Return updated user
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'ER_DUP_ENTRY') {
        // Unique constraint violation
        throw new BadRequestException('User with this Email already exist');
      }
      throw new InternalServerErrorException({
        message: 'Failed to update user',
        error: error,
      });
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        rethrow(new NotFoundException(`User with ID ${id} not found`));
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async findOne(user: UserModel) {
    const foundedUser = await this.userRepository.findOne({
      where: { id: user?.id },
    });
    if (!foundedUser) {
      throw new NotFoundException('ERR_NOT_FOUND_USER');
    }
    return foundedUser;
  }

  async period(periodDto: PeriodDto, user: UserModel) {
    const {
      startDateOfLastPeriod,
      durationOfLastPeriod,
      avgCycleLength,
      upComingMonth,
    } = periodDto;
    try {
      const scale = ScaleData[avgCycleLength];
      const results = calculatePeriodDates({
        startDateOfLastPeriod: startDateOfLastPeriod.toDateString(),
        durationOfLastPeriod,
        avgCycleLength: scale,
        upComingMonth,
      });
      const promise = results.map((result) => {
        return this.periodService.createPeriod(
          {
            periodDays: this.getPeriodDays(result?.period),
            periodMonth: this.getPeriodDays(result?.period)[0].getMonth() + 1,
            ovulationDays: this.getPeriodDays(
              result?.mostProbableOvulationDays,
            ),
          },
          user,
        );
      });
      return await Promise.all(promise);
    } catch (e) {
      throw new ConflictException({
        message: 'Error Period Calculation',
        error: e,
      });
    }
  }

  getPeriodDays(period: string) {
    let startDateStr: string;
    let endDateStr: string;
    [startDateStr, endDateStr] = period.split(' - ');
    if (new Date(startDateStr) > new Date(endDateStr)) {
      [endDateStr, startDateStr] = period.split(' - ');
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const periodDays: Date[] = [];
    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      periodDays.push(new Date(date));
    }
    return periodDays;
  }

  private isImageFile(file: Express.Multer.File) {
    const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.svg',
      '.webp',
    ];
    const extension = file.originalname
      .slice(file.originalname.lastIndexOf('.') || Infinity)
      .toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      throw new ConflictException('This is not an image file.');
    }
  }
}
