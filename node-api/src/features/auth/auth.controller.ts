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
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

import { JoiValidationPipe } from '@/internal/pipes';
import { AuthGuard } from '@/internal/guards';
import { RequestWithEntity } from '@/internal/interfaces';
import { cookieOptions } from '@/internal/helpers';

import {
  LoginDTO,
  UserRegisterDTO,
  ArtistRegisterDTO,
  VerifyEmailDTO,
  SendRecoveryCodeDTO,
  ChangePasswordDTO,
} from './auth.dto';
import {
  loginSchema,
  userRegisterSchema,
  artistRegisterSchema,
  emailVerificationSchema,
  recoveryCodeSchema,
  changePasswordSchema,
} from './auth.schemas';
import { AuthService } from './auth.service';
import { EmailService } from '../email/email.service';

@Controller()
export class AuthController {
  constructor(
    private auth: AuthService,
    private email: EmailService,
    private config: ConfigService,
  ) {}

  @Post('register/user')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(userRegisterSchema))
  async userRegister(
    @Body() newUser: UserRegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request,
  ) {
    const ipAddress = request.headers['x-forwarded-for'] || request.ip;
    const { user } = await this.auth.createUser({ ...newUser, ipAddress });
    const token = this.getJwt({ ...user });

    response.cookie('token', token, cookieOptions);

    await this.email.sendVerificationEmail(user.email);

    return {
      message: 'Cuenta creada exitosamente',
      user,
    };
  }

  @Post('register/artist')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(artistRegisterSchema))
  async artistRegister(
    @Body() newArtist: ArtistRegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { artist } = await this.auth.createArtist(newArtist);
    const token = this.getJwt({ ...artist });

    response.cookie('token', token, { ...cookieOptions });

    await this.email.sendVerificationEmail(artist.email);

    return {
      message: 'Cuenta creada exitosamente',
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
      message: 'Sesión iniciada exitosamente',
      entity,
    };
  }

  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(emailVerificationSchema))
  async verifyEmail(@Body() data: VerifyEmailDTO) {
    const { isEmailVerified, entity } = await this.auth.verifyEmail(data);

    return {
      message: 'Email verificado exitosamente',
      verifiedEmail: isEmailVerified,
      entity,
    };
  }

  @Post('send-recovery-code')
  @UsePipes(new JoiValidationPipe(recoveryCodeSchema))
  async sendAccountRecoveryCode(@Body() { email, isArtist }: SendRecoveryCodeDTO) {
    const { code, entityId } = await this.auth.getRecoveryCode(email, isArtist);
    const status = await this.email.sendRecoveryCode(email, code);

    return {
      message: 'Revisa tu bandeja de entrada, ahí están las instrucciones para continuar',
      status,
      code,
      entityId,
    };
  }

  @Put('change-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new JoiValidationPipe(changePasswordSchema))
  async changePassword(@Body() { newPassword, entityID, isArtist }: ChangePasswordDTO) {
    await this.auth.changePassword(newPassword, entityID, isArtist);

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@Req() request: RequestWithEntity) {
    return { entity: request.entity };
  }

  @Get('home')
  @UseGuards(AuthGuard)
  async getHomeData(@Req() request: RequestWithEntity) {
    return await this.auth.getHomeData(Number(request.entity.id));
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
