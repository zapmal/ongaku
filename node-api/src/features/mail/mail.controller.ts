import { Body, Controller, Post } from '@nestjs/common';

import { MailService } from './mail.service';
import { ResendVerificationMailDTO } from './mail.dto';

@Controller()
export class MailController {
  constructor(private mail: MailService) {}

  @Post('/resend-verification')
  async resendVerificationMail(@Body() body: ResendVerificationMailDTO) {
    const { status } = await this.mail.sendVerificationEmail(body.to);

    return {
      message: 'Success! Check your inbox for further instructions',
      status,
    };
  }
}
