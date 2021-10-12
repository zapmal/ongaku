import {
  Body,
  Controller,
  Post,
  BadRequestException as BadRequest,
  UnauthorizedException as Unauthorized,
  NotFoundException as NotFound,
  UsePipes,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

import { JoiValidationPipe } from '@common/pipes/joi.pipe';
import { AuthGuard } from '@common/guards';
import { cookieOptions } from '@utils/cookie';

import { SigninDTO, SignupDTO } from './auth.dto';
import { signinSchema, signupSchema } from './auth.schemas';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(signupSchema))
  async signup(
    @Body() { fullName, password, email }: SignupDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const hashedPassword = await hash(password, 10);

    const user = await this.authService.signup({
      fullName,
      password: hashedPassword,
      email,
      birthdate: new Date(), // Temporary fix.
    });

    if (!user) {
      throw new BadRequest(
        'Something went wrong while trying to create the user, try again.',
      );
    }

    const token = sign({ user }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    response.cookie('token', token, cookieOptions);

    return {
      message: 'Account created successfully.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  @Post('signin')
  @UsePipes(new JoiValidationPipe(signinSchema))
  async signin(
    @Body() userCredentials: SigninDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.getUserByEmail(userCredentials.email);

    if (!user) {
      throw new NotFound('The user does not exist.');
    }

    const passwordsMatch = await compare(
      userCredentials.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new Unauthorized('The password does not match.');
    }

    const token = sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY_TIME,
      },
    );

    response.cookie('token', token, cookieOptions);

    return {
      message: 'Signed in successfully.',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  @Get('csrf')
  getCsrfToken(@Req() request: Request) {
    return { csrf: request.csrfToken() };
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  test(@Req() request: Request & { user: Record<string, unknown> }) {
    return { user: request.user };
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');

    return { message: 'Logged out successfully.' };
  }
}
