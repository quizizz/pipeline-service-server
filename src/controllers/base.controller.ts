import { Request, Response } from '@app/domains/app';

export interface ValidationResult {
  error?: {
    details: { message: string }[];
  };
  value: any;
}

export default interface BaseController {
  name: string;
  sanitize?: (input: Request<unknown, unknown, unknown>) => void;
  validate?: (
    input: Request<unknown, unknown, unknown>,
  ) => void | ValidationResult;
  exec(
    req?: Request<unknown, unknown, unknown>,
  ): void | Promise<void> | Promise<Response<unknown>> | never;
}
