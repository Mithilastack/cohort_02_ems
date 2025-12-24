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
    bookingDetails: {
      eventTitle: string;
      eventDate: string;
      eventTime: string;
      venue: string;
      quantity: number;
      totalAmount: number;
      status: 'pending' | 'confirmed' | 'cancelled';
    }
  ): Promise<void> {
    const statusConfig = {
      pending: {
        text: 'Pending',
        color: '#3b82f6',
        bgColor: '#dbeafe',
        borderColor: '#3b82f6',
        icon: '⏳',
        message: 'Your booking is currently pending approval.',
        action: 'We will notify you once it has been reviewed.',
      },
      confirmed: {
        text: 'Confirmed',
        color: '#10b981',
        bgColor: '#d1fae5',
        borderColor: '#10b981',
        icon: '✅',
        message: 'Great news! Your booking has been confirmed.',
        action: 'We look forward to seeing you at the event!',
      },
      cancelled: {
        text: 'Cancelled',
        color: '#ef4444',
        bgColor: '#fee2e2',
        borderColor: '#ef4444',
        icon: '❌',
        message: 'Your booking has been cancelled.',
        action: 'If this was a mistake, please contact our support team.',
      },
    };

    const config = statusConfig[bookingDetails.status];

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}
.email-wrapper {
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 30px;
  text-align: center;
}
.header h1 {
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.content {
  padding: 40px 30px;
}
.status-banner {
  background-color: ${config.bgColor};
  border-left: 6px solid ${config.borderColor};
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  text-align: center;
}
.status-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.status-title {
  color: ${config.color};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}
.status-message {
  color: #4b5563;
  font-size: 16px;
  line-height: 1.6;
}
.event-details {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}
.event-title {
  color: #111827;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}
.detail-row:last-child {
  border-bottom: none;
}
.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.detail-value {
  color: #111827;
  font-weight: 600;
  font-size: 16px;
  text-align: right;
}
.total-amount {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin: 24px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.total-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 4px;
}
.total-value {
  font-size: 32px;
  font-weight: 700;
}
.action-message {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  border-radius: 8px;
  margin: 24px 0;
}
.action-message p {
  color: #92400e;
  font-size: 14px;
  margin: 0;
}
.footer {
  background-color: #f9fafb;
  padding: 30px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}
.footer p {
  color: #6b7280;
  font-size: 14px;
  margin: 8px 0;
}
.footer-links {
  margin-top: 16px;
}
.footer-link {
  color: #667eea;
  text-decoration: none;
  margin: 0 12px;
  font-weight: 500;
}
@media only screen and (max-width: 600px) {
  body {
    padding: 20px 10px;
  }
  .header {
    padding: 30px 20px;
  }
  .header h1 {
    font-size: 24px;
  }
  .content {
    padding: 30px 20px;
  }
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .detail-value {
    text-align: left;
  }
}
</style>
</head>
<body>
<div class="email-wrapper">
  <div class="header">
    <h1>${config.icon} Booking Status Update</h1>
  </div>
  
  <div class="content">
    <div class="status-banner">
      <div class="status-icon">${config.icon}</div>
      <div class="status-title">Booking ${config.text.toUpperCase()}</div>
      <div class="status-message">${config.message}</div>
    </div>

    <div class="event-details">
      <div class="event-title">${bookingDetails.eventTitle}</div>
      
      <div class="detail-row">
        <span class="detail-label">📅 Date</span>
        <span class="detail-value">${bookingDetails.eventDate}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">🕐 Time</span>
        <span class="detail-value">${bookingDetails.eventTime}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">📍 Venue</span>
        <span class="detail-value">${bookingDetails.venue}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">🎫 Tickets</span>
        <span class="detail-value">${bookingDetails.quantity} ticket(s)</span>
      </div>
    </div>

    <div class="total-amount">
      <div class="total-label">Total Amount</div>
      <div class="total-value">₹${bookingDetails.totalAmount.toLocaleString('en-IN')}</div>
    </div>

    <div class="action-message">
      <p><strong>📌 Note:</strong> ${config.action}</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>Thank you for using EMS!</strong></p>
    <p>For any queries, please contact our support team.</p>
    <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">
      Copyright © ${new Date().getFullYear()} Event Management System. All rights reserved.
    </p>
  </div>
</div>
</body>
</html>`;

    await this.sendEmail({
      to: email,
      subject: `Booking ${config.text} - ${bookingDetails.eventTitle}`,
      html,
    });
  }
}

export const emailService = new EmailService();
