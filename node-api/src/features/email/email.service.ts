import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  ServiceUnavailableException as ServiceUnavailable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getHash } from '@/internal/helpers';

@Injectable()
export class EmailService {
  constructor(private mailer: MailerService, private config: ConfigService) {}

  async sendVerificationEmail(to: string) {
    const FRONTEND_URL = this.config.get('FRONTEND_URL');
    const hash = getHash(to);

    const url = `${FRONTEND_URL}/verify/${hash}`;
    const context = { context: { url } };

    return await this.sendEmail(
      to,
      'Email Verification',
      './email-verification',
      context,
    );
  }

  async sendRecoveryCode(to: string, code: number) {
    const context = { context: { code } };

    return await this.sendEmail(to, 'Account Recovery', './account-recovery', context);
  }

  private async sendEmail(to, subject, template, context) {
    try {
      await this.mailer.sendMail({
        to,
        subject,
        template,
        ...context,
      });

      return 'SENT';
    } catch (error) {
      throw new ServiceUnavailable(
        'We could not send the email right now, please try again later',
      );
    }
  }
}
