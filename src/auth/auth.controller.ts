import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseHandler } from 'src/common/helpers/response-handler';
import type{ Response } from 'express';
import { SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post('signup')
  async signUp(@Res() res: Response, @Body() dto: SignUpDto, @Req() req: Request) {
    try {
      const result = await this.authService.signUp(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, error.message);
    }
  }
}
