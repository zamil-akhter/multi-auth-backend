import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ResponseHandler } from 'src/common/helpers/response-handler';
import { USER_MODEL, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtHelperService } from 'src/common/helpers/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]), JwtModule.register({ secret: process.env.JWT_SECRET || 'defaultSecret', signOptions: { expiresIn: '1d' } })],
  controllers: [AuthController],
  providers: [AuthService, ResponseHandler, JwtHelperService],
})
export class AuthModule {}
