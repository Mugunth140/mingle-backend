import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    findAll() {
        const users = this.userRepository.find();
        return users;
    }

    findOne(id : number) {
        const user = this.userRepository.findOne({ where: { id } });
        return user;  
    }

   async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        return this.userRepository.save({ ...user, ...updateUserDto });
    }

    remove(id: number) {
        return this.userRepository.delete(id)
    }
}
