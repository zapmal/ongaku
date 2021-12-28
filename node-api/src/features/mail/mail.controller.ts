import { Body, Controller, Post } from '@nestjs/common';

import { MailService } from './mail.service';
import { ResendVerificationMailDTO } from './mail.dto';

@Controller()
export class MailController {
  constructor(private mail: MailService) {}

  @Post('/resend-verification')
  async resendVerificationMail(@Body() { to }: ResendVerificationMailDTO) {
    await this.mail.sendVerificationEmail(to);

    return {
      message: 'Email sent! Check your inbox',
    };
  }
}
