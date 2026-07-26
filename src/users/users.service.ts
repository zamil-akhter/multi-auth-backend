import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const isUserExists = await this.userModel.findOne({ email });
    if (isUserExists) {
      throw new Error('User with this email already exists.');
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({ name, email, password: hashedPassword });
  }

  async findAll() {
    return this.userModel.find().exec();
  }
}
