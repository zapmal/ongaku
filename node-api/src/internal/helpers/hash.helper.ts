import { createHash } from 'crypto';

export const getHash = (content) => {
  return createHash('sha256').update(content).digest('hex').slice(0, 10);
};
