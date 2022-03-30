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
      'Verificación de Correo',
      './email-verification',
      context,
    );
  }

  async sendRecoveryCode(to: string, code: number) {
    const context = { context: { code } };

    return await this.sendEmail(
      to,
      'Recuperación de Cuenta',
      './account-recovery',
      context,
    );
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
        'No pudimos enviar el correo ahora mismo, revisa tu conexión a internet e intentalo de nuevo',
      );
    }
  }
}
