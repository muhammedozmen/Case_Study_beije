import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      this.logger.warn('SendGrid API key not found. Email functionality will be disabled.');
      return;
    }
    sgMail.setApiKey(apiKey);
  }

  async sendVerificationEmail(
    receiverEmail: string,
    username: string,
    verificationToken: string,
  ): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      this.logger.warn('SendGrid API key not configured. Skipping email send.');
      return;
    }

    const fromName = this.configService.get<string>('MAIL_FROM_NAME');
    const fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL');
    const appBaseUrl = this.configService.get<string>('APP_BASE_URL');
    const verificationTemplateId = this.configService.get<string>('SENDGRID_VERIFICATION_TEMPLATE_ID');

    if (!verificationTemplateId) {
      this.logger.error('SendGrid verification template ID not configured');
      throw new Error('Email template not configured');
    }

    const verificationLink = `${appBaseUrl}/user/verify-email/${username}/${verificationToken}`;

    const msg = {
      to: receiverEmail,
      from: {
        email: fromEmail,
        name: fromName,
      },
      templateId: verificationTemplateId,
      dynamicTemplateData: {
        username: username,
        verification_link: verificationLink,
        app_name: 'Email Verification System',
        app_base_url: appBaseUrl,
      },
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Verification email sent to ${receiverEmail} using template ${verificationTemplateId}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${receiverEmail}:`, error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(receiverEmail: string, username: string): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      this.logger.warn('SendGrid API key not configured. Skipping welcome email.');
      return;
    }

    const fromName = this.configService.get<string>('MAIL_FROM_NAME');
    const fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL');
    const appBaseUrl = this.configService.get<string>('APP_BASE_URL');
    const welcomeTemplateId = this.configService.get<string>('SENDGRID_WELCOME_TEMPLATE_ID');

    if (!welcomeTemplateId) {
      this.logger.warn('SendGrid welcome template ID not configured. Skipping welcome email.');
      return;
    }

    const msg = {
      to: receiverEmail,
      from: {
        email: fromEmail,
        name: fromName,
      },
      templateId: welcomeTemplateId,
      dynamicTemplateData: {
        username: username,
        app_name: 'Email Verification System',
        app_url: appBaseUrl,
        profile_url: `${appBaseUrl}/profile`,
      },
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Welcome email sent to ${receiverEmail} using template ${welcomeTemplateId}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${receiverEmail}:`, error);
      // Don't throw error for welcome email, it's not critical
    }
  }
}
