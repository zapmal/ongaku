import { Body, Controller, Post } from '@nestjs/common';

import { EmailService } from './email.service';
import { ResendVerificationEmailDTO } from './email.dto';

@Controller()
export class EmailController {
  constructor(private email: EmailService) {}

  @Post('/resend-verification-email')
  async resendVerificationEmail(@Body() body: ResendVerificationEmailDTO) {
    const status = await this.email.sendVerificationEmail(body.to);

    return {
      message: 'Success! Check your inbox for further instructions',
      status,
    };
  }
}
