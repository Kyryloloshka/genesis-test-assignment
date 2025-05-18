import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const confirmUrl = `${process.env.APP_URL}/confirm.html?token=${token}`;

    const mailOptions = {
      from: `"Weather App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Confirm your weather subscription',
      html: `
        <p>Thank you for subscribing!</p>
        <p>Click the link below to confirm your subscription:</p>
        <a href="${confirmUrl}">Confirm</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new Error('Failed to send confirmation email');
    }
  }

  async sendWeatherUpdate({
    email,
    city,
    token,
    weather,
  }: {
    email: string;
    city: string;
    token: string;
    weather: {
      temperature: number;
      humidity: string;
      description: string;
    };
  }): Promise<void> {
    const mailOptions = {
      from: `"Weather App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Here is your weather update ${city}`,
      html: `
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Humidity: ${weather.humidity}%</p>
        <p>Description: ${weather.description}</p>
        <p>Thank you for using our service!</p>
        <p>If you wish to unsubscribe, please click <a href="${process.env.APP_URL}/unsubscribe.html?token=${token}">here</a>.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      throw new Error('Failed to send confirmation email');
    }
  }
}
