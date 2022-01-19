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

    try {
      await this.mailer.sendMail({
        to,
        subject: 'Email Verification',
        template: './email-verification',
        context: {
          url,
        },
      });

      return 'SENT';
    } catch (error) {
      throw new ServiceUnavailable(
        'We could not send the email right now, please try again later',
      );
    }
  }

  async sendRecoveryCode(to: string, code: number) {
    try {
      await this.mailer.sendMail({
        to,
        subject: 'Account Recovery',
        template: './account-recovery',
        context: {
          code,
        },
      });

      return 'SENT';
    } catch (error) {
      throw new ServiceUnavailable(
        'We could not send the email right now, please try again later',
      );
    }
  }
}
