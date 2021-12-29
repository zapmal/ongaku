import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getHash } from '@/internal/helpers';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService, private config: ConfigService) {}

  async sendVerificationEmail(to: string) {
    const FRONTEND_URL = this.config.get('FRONTEND_URL');
    const hash = getHash(to);

    const url = `${FRONTEND_URL}/verify/${hash}`;

    await this.mailer.sendMail({
      to,
      subject: 'Email Verification',
      template: './verification',
      context: {
        url,
      },
    });
  }

  /**
   * The token needs to be generated either on the frontend or the backend with
   * an expiry time and be kept/merged with the user's data temporarily, like so:
   *
   * user = {
   *   ...user relevant information,
   *   token: { value, expiryTime }
   * }
   *
   * This way the confirmation page can be restricted after a period of time and
   * only the new user will be able to "confirm" their account. This process
   * can be applied to account resets via email too.
   *
   * Another simple and equally good approach is to use a popup + send a code
   * to the user's mail, this would use the expiry time too.
   */
}
