import {
  Body,
  Controller,
  Post,
  UsePipes,
  Res,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

import { JoiValidationPipe } from '@/internal/pipes';
import { AuthGuard, DuplicateEntityGuard } from '@/internal/guards';
import { cookieOptions } from '@/internal/helpers';

import { LoginDTO, UserRegisterDTO, ArtistRegisterDTO, VerifyEmailDTO } from './auth.dto';
import { loginSchema, userRegisterSchema, artistRegisterSchema } from './auth.schemas';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';

@Controller()
export class AuthController {
  constructor(
    private auth: AuthService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  @Post('register/user')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(userRegisterSchema))
  @UseGuards(DuplicateEntityGuard)
  async userRegister(
    @Body() newUser: UserRegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request,
  ) {
    const ipAddress = request.headers['x-forwarded-for'] || request.ip;
    const { user } = await this.auth.createUser({ ...newUser, ipAddress });
    const token = this.getJwt({ ...user });

    response.cookie('token', token, cookieOptions);

    await this.mail.sendVerificationEmail(user.email);

    return {
      message: 'Account created successfully!',
      user,
    };
  }

  @Post('register/artist')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(artistRegisterSchema))
  @UseGuards(DuplicateEntityGuard)
  async artistRegister(
    @Body() newArtist: ArtistRegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { artist } = await this.auth.createArtist(newArtist);
    const token = this.getJwt({ ...artist });

    response.cookie('token', token, { ...cookieOptions });

    await this.mail.sendVerificationEmail(artist.email);

    return {
      message: 'Account created successfully.',
      artist,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new JoiValidationPipe(loginSchema))
  async login(
    @Body() credentials: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { entity } = await this.auth.login(credentials);
    const token = this.getJwt({ ...entity });

    response.cookie('token', token, { ...cookieOptions });

    return {
      message: 'Logged in successfully',
      entity,
    };
  }

  @Get('logout')
  @HttpCode(HttpStatus.RESET_CONTENT)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');

    return { message: 'Logged out successfully' };
  }

  @Post('verify')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard)
  async verifyEmail(@Body() data: VerifyEmailDTO) {
    const { verifiedEmail } = await this.auth.verifyEmail(data);

    return {
      message: 'Email verified successfully!',
      verifiedEmail,
    };
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@Req() request: Request & { entity: Record<string, unknown> }) {
    return { entity: request.entity };
  }

  @Get('csrf')
  getCsrfToken(@Req() request: Request) {
    return { csrf: request.csrfToken() };
  }

  getJwt(payload: Record<string, unknown>) {
    return sign(payload, this.config.get('JWT_SECRET'), {
      expiresIn: this.config.get('JWT_EXPIRY_TIME'),
    });
  }
}
