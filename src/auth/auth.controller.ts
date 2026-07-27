import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseHandler } from 'src/common/helpers/response-handler';
import type { Response } from 'express';
import { LogInDto, SignUpDto } from './dto/auth.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @Post('login')
  async logIn(@Res() res: Response, @Body() dto: LogInDto, @Req() req: Request) {
    try {
      const result = await this.authService.logIn(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithDataAndToken(res, result.message, result.data, result.token ?? '');
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, error.message);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getMe(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.getMe(req.user._id);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, error.message);
    }
  }
}
