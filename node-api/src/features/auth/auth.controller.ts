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
  @UsePipes(new JoiValidationPipe(userRegisterSchema))
  @UseGuards(DuplicateEntityGuard)
  async userRegister(
    @Body() newUser: UserRegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request,
  ) {
    const ipAddress = request.headers['x-forwarded-for'] || request.ip;
    const { user, token } = await this.auth.createUser({
      ...newUser,
      ipAddress,
    });

    response.cookie('token', token, cookieOptions);

    await this.mail.sendVerificationEmail(user.email);

    return {
      message: 'Account created successfully!',
      user,
    };
  }

  @Post('register/artist')
  @UsePipes(new JoiValidationPipe(artistRegisterSchema))
  @UseGuards(DuplicateEntityGuard)
  async artistRegister(
    @Body() newArtist: ArtistRegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { artist, token } = await this.auth.createArtist(newArtist);

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
    const { entity, token } = await this.auth.login(credentials);

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
}
