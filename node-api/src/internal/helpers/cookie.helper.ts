import { CookieOptions } from 'express';

/**
 * The maxAge is approx ~2 months.
 */
const options: CookieOptions = {
  maxAge: 86400 * 90,
  secure: false,
  httpOnly: true,
  sameSite: 'lax',
};

export { options as cookieOptions };
