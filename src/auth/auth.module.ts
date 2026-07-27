import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ResponseHandler } from 'src/common/helpers/response-handler';
import { USER_MODEL, UserSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, ResponseHandler],
})
export class AuthModule {}
