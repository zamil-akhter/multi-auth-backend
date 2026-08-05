import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAILID,
      pass: process.env.GMAILPASSWORD,
    },
  });

  async sendVerificationEmail(to: string, name: string, token: string) {
    const baseUrl = this.configService.get<string>('CLIENT_URL')?.replace(/\/$/, '') || `http://localhost:${process.env.PORT || 3000}`;
    const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}`;

    const templatePath = path.join(process.cwd(), 'src/mail/templates/verify-email.ejs');

    const html = await ejs.renderFile(templatePath, {
      name,
      verifyUrl,
    });

    await this.transporter.sendMail({
      from: `"Your App" <${process.env.GMAILID}>`,
      to,
      subject: 'Verify your email',
      html,
    });
  }
}
