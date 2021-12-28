import { CookieOptions } from 'express';

const options: CookieOptions = {
  maxAge: 7889400000,
  secure: false,
  httpOnly: true,
  sameSite: 'lax',
};

export { options as cookieOptions };
