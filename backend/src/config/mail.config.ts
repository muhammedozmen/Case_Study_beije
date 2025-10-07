import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  fromName: process.env.MAIL_FROM_NAME || 'Email Verification',
  fromEmail: process.env.MAIL_FROM_EMAIL || 'no-reply@example.com',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
}));
