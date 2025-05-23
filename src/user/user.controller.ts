import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() Body: CreateUserDto) {
    return this.userService.create(Body);
  }

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  updateUser(@Param(':id') id: number, @Body() Body: UpdateUserDto) {
    return this.userService.update(id, Body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
