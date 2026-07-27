import { Injectable } from '@nestjs/common';
import { LogInDto, SignUpDto } from './dto/auth.dto';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { messages } from 'src/common/helpers/message';
import { JwtHelperService } from 'src/common/helpers/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDocument>,
    private readonly jwtHelperService: JwtHelperService,
  ) {}
  async signUp(dto: SignUpDto): Promise<{ success: boolean; message: string; data?: SignUpDto }> {
    const { name, email, password } = dto;

    const isUserExists = await this.userModel.findOne({ email });
    if (isUserExists) {
      return { success: false, message: messages.USER_ALREADY_EXISTS };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.create({ name, email, password: hashedPassword });

    return { success: true, message: messages.SIGNUP_SUCCESS };
  }

  async logIn(dto: LogInDto): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    const token = await this.jwtHelperService.generateToken({ sub: user._id });

    return { success: true, message: 'Login successful', data: { userId: user._id, name: user.name, email: user.email }, token: token };
  }
}
