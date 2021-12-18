import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

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
  async sendUserConfirmation(user: any, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const url = `${frontendUrl}/auth/confirmation?token=${token}`;
    // const url = `${frontendUrl}/account-confirmation/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Ongaku!',
      template: './confirmation',
      context: {
        name: user.username,
        url,
      },
    });
  }
}
