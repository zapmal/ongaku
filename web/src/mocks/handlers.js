import { rest } from 'msw';

export const handlers = [rest.post('/example', null)];
