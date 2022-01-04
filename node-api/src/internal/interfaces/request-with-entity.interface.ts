import { Request } from 'express';

export interface RequestWithEntity extends Request {
  entity: Record<string, unknown>;
}
