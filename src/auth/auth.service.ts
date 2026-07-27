import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/auth.dto';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { messages } from 'src/common/helpers/message';

@Injectable()
export class AuthService {
  constructor(@InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>) {}
  async signUp(dto: SignUpDto): Promise<{ success: boolean; message: string; data?: SignUpDto }> {
    const { name, email, password } = dto;

    const isUserExists = await this.userModel.findOne({ email });
    if (isUserExists) {
      return { success: false, message: messages.USER_ALREADY_EXISTS };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({ name, email, password: hashedPassword });

    return { success: true, message: messages.USER_SIGNUP_SUCCESS };
  }
}
