import { Injectable } from '@nestjs/common';
import { LogInDto, SignUpDto } from './dto/auth.dto';
import { USER_MODEL, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { messages } from 'src/common/helpers/message';
import { JwtHelperService } from 'src/common/helpers/jwt.service';
import * as crypto from 'crypto';

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
    const token = crypto.randomBytes(32).toString('hex');
    await this.userModel.create({ name, email, password: hashedPassword, emailVerificationToken: token, emailVerificationExpires: new Date(Date.now() + 60 * 60 * 1000) });

    return { success: true, message: messages.SIGNUP_SUCCESS };
  }

  async logIn(dto: LogInDto): Promise<{ success: boolean; message: string; data?: any; token?: string }> {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { success: false, message: messages.INVALID_CREDENTIALS };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: messages.INVALID_CREDENTIALS };
    }

    const token = await this.jwtHelperService.generateToken({ sub: user._id });

    return { success: true, message: messages.LOGIN_SUCCESS, data: { userId: user._id, name: user.name, email: user.email }, token: token };
  }

  async getMe(userId: string): Promise<{ success: boolean; message: string; data?: any }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return { success: false, message: messages.PROFILE_FETCH_FAILED };
    }

    return {
      success: true,
      message: messages.PROFILE_FETCH_SUCCESS,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}
