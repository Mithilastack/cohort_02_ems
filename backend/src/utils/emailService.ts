import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    const port = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Debug logging
    logger.info(`SMTP Configuration - Host: ${process.env.SMTP_HOST}, Port: ${port}, User: ${smtpUser ? 'SET' : 'NOT SET'}, Pass: ${smtpPass ? 'SET' : 'NOT SET'}`);

    if (!smtpUser || !smtpPass) {
      logger.error('SMTP credentials are missing!');
      throw new Error('SMTP_USER and SMTP_PASS must be set in environment variables');
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    return this.transporter;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const transporter = this.getTransporter();
      const mailOptions = {
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendOTPEmail(email: string, otp: string, purpose: 'verification' | 'reset'): Promise<void> {
    const subject = purpose === 'verification'
      ? 'Verify Your Email - EMS'
      : 'Reset Your Password - EMS';

    const title = purpose === 'verification'
      ? 'Email Verification'
      : 'Password Reset';

    const message = purpose === 'verification'
      ? 'Thank you for signing up! Please use the OTP below to verify your email address.'
      : 'You have requested to reset your password. Please use the OTP below to proceed.';

    const html = `<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.container {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.header {
  text-align: center;
  color: #4a5568;
  margin-bottom: 30px;
}
.otp-box {
  background-color: #667eea;
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  letter-spacing: 8px;
  margin: 30px 0;
}
.message {
  text-align: center;
  color: #4a5568;
  margin: 20px 0;
}
.footer {
  text-align: center;
  color: #718096;
  font-size: 14px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.warning {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 12px;
  margin: 20px 0;
  border-radius: 4px;
  color: #856404;
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>${title}</h1>
  </div>
  <div class="message">
    <p>${message}</p>
  </div>
  <div class="otp-box">
    ${otp}
  </div>
  <div class="warning">
    <strong>Warning:</strong> This OTP will expire in 10 minutes. Do not share this code with anyone.
  </div>
  <div class="footer">
    <p>If you did not request this, please ignore this email.</p>
    <p>Copyright ${new Date().getFullYear()} EMS. All rights reserved.</p>
  </div>
</div>
</body>
</html>`;

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendBookingConfirmationEmail(
    email: string,
    bookingDetails: {
      eventTitle: string;
      eventDate: string;
      eventTime: string;
      venue: string;
      quantity: number;
      totalAmount: number;
    }
  ): Promise<void> {
    const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
.container { background-color: #f9f9f9; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header { text-align: center; color: #4a5568; margin-bottom: 30px; }
.success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px; color: #155724; }
.details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
.detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
.label { font-weight: bold; color: #4a5568; }
.value { color: #2d3748; }
.total { background-color: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; margin: 20px 0; }
.footer { text-align: center; color: #718096; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🎉 Booking Confirmed!</h1>
  </div>
  <div class="success">
    <strong>Success!</strong> Your booking has been confirmed.
  </div>
  <div class="details">
    <div class="detail-row">
      <span class="label">Event:</span>
      <span class="value">${bookingDetails.eventTitle}</span>
    </div>
    <div class="detail-row">
      <span class="label">Date:</span>
      <span class="value">${bookingDetails.eventDate}</span>
    </div>
    <div class="detail-row">
      <span class="label">Time:</span>
      <span class="value">${bookingDetails.eventTime}</span>
    </div>
    <div class="detail-row">
      <span class="label">Venue:</span>
      <span class="value">${bookingDetails.venue}</span>
    </div>
    <div class="detail-row">
      <span class="label">Quantity:</span>
      <span class="value">${bookingDetails.quantity} ticket(s)</span>
    </div>
  </div>
  <div class="total">
    <strong>Total Amount: ₹${bookingDetails.totalAmount}</strong>
  </div>
  <div class="footer">
    <p>Thank you for booking with EMS!</p>
    <p>Copyright ${new Date().getFullYear()} EMS. All rights reserved.</p>
  </div>
</div>
</body>
</html>`;

    await this.sendEmail({
      to: email,
      subject: `Booking Confirmed - ${bookingDetails.eventTitle}`,
      html,
    });
  }

  async sendBookingStatusUpdateEmail(
    email: string,
    eventTitle: string,
    status: string
  ): Promise<void> {
    const statusMessages: any = {
      completed: { text: 'completed', color: '#28a745', icon: '✅' },
      cancelled: { text: 'cancelled', color: '#dc3545', icon: '❌' },
      booked: { text: 'confirmed', color: '#007bff', icon: '🎫' },
    };

    const statusInfo = statusMessages[status] || statusMessages.booked;

    const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
.container { background-color: #f9f9f9; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.header { text-align: center; color: #4a5568; margin-bottom: 30px; }
.status-box { background-color: ${statusInfo.color}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
.message { text-align: center; color: #4a5568; margin: 20px 0; }
.footer { text-align: center; color: #718096; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Booking Status Update</h1>
  </div>
  <div class="status-box">
    <h2>${statusInfo.icon} Booking ${statusInfo.text.toUpperCase()}</h2>
  </div>
  <div class="message">
    <p>Your booking for <strong>${eventTitle}</strong> has been ${statusInfo.text}.</p>
  </div>
  <div class="footer">
    <p>If you have any questions, please contact our support team.</p>
    <p>Copyright ${new Date().getFullYear()} EMS. All rights reserved.</p>
  </div>
</div>
</body>
</html>`;

    await this.sendEmail({
      to: email,
      subject: `Booking ${statusInfo.text} - ${eventTitle}`,
      html,
    });
  }
}

export const emailService = new EmailService();
