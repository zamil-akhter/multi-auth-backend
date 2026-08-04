import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAILID,
      pass: process.env.GMAILPASSWORD,
    },
  });

  async sendVerificationEmail(to: string, name: string, token: string) {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

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
