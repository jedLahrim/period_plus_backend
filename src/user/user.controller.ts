import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.register(userData);
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<UserModel> {
    const { email, password } = credentials;
    return this.userService.login(email, password);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.findById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOne(@GetUser() user: UserModel): Promise<UserModel> {
    return this.userService.findOne(user);
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('profileImageFile'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profileImageFile: Express.Multer.File,
  ) {
    return this.userService.update(id, updateUserDto, profileImageFile);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
