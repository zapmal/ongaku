import { Controller, Get } from '@nestjs/common';

import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(private mail: MailService) {}

  @Get('verify-email')
  async sendVerificationEmail() {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const user = {
      email: '',
      username: '',
    };

    await this.mail.sendUserConfirmation(user, token);

    return {
      message: 'This is still being tested!',
    };
  }
}
