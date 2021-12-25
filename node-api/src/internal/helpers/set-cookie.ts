import { Response } from 'express';

type CookieOptions = {
  maxAge: number;
  secure?: boolean;
  httpOnly?: boolean;
};

const setCookie = (response: Response, value: string, key: string, secure = false) => {
  let options: CookieOptions = {
    maxAge: 1000 * 3600 * 24 * 30 * 2,
  };

  if (secure) {
    options = {
      maxAge: options.maxAge,
      secure: true,
      httpOnly: true,
    };
  }

  const cookie = response.cookie(key, value, options);

  return cookie;
};

export default setCookie;
