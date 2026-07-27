import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { messages } from '../helpers/message';

@Injectable()
export class ResponseHandler {
  successResponse(res: Response, msg: string) {
    return res.status(200).json({ statusCode: 200, message: msg });
  }

  successResponseWithData(res: Response, msg: string, responseData) {
    return res.status(200).json({ statusCode: 200, message: msg, data: responseData });
  }

  successResponseWithToken(res: Response, msg: string, token: string) {
    return res.status(200).json({
      statusCode: 200,
      message: msg,
      token: token,
    });
  }

  successResponseWithDataAndToken(res: Response, msg: string, responseData = {}, token: string) {
    return res.status(200).json({
      statusCode: 200,
      message: msg,
      data: responseData,
      token: token,
    });
  }

  errorResponse(res: Response, msg: string) {
    return res.status(400).json({ statusCode: 400, message: msg });
  }

  errorResponseWithData(res: Response, msg: string, responseData: any) {
    return res.status(400).json({
      statusCode: 400,
      message: msg,
      data: responseData,
    });
  }

  unAuthorizeErrorResponse(res: Response, msg: string) {
    return res.status(401).json({ statusCode: 401, message: msg });
  }

  catchErrorResponse(res: Response, msg: string) {
    // Log the actual error for debugging
    console.error(`[Internal Error]: ${msg}`);

    // If in production, sanitize the message
    const isProduction = process.env.NODE_ENV === 'production';
    console.log;
    const publicMessage = isProduction ? messages.INTERNAL_SERVER_ERROR : msg;

    return res.status(500).json({
      statusCode: 500,
      error: messages.INTERNAL_SERVER_ERROR,
      message: publicMessage,
    });
  }
}
