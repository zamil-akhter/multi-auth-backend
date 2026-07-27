import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/auth.dto';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>) {}
  async signUp(dto: SignUpDto): Promise<{ success: boolean; message: string; data?: any }> {
    const { name, email, password } = dto;

    const isUserExists = await this.userModel.findOne({ email });
    if (isUserExists) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    this.userModel.create({ name, email, password: hashedPassword });

    return {
      success: true,
      message: 'User signed up successfully',
      data: {},
    };
  }
}
