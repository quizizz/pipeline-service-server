import { Request, Response } from '@app/domains/app';
import Joi from 'joi';

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

/**
 * Helper for joi schema validation
 * @param schema joi schema
 * @param body any request body
 * @returns ValidationResult if any errors
 */
export function joiValidationResult(
  schema: Joi.Schema<any>,
  body: unknown,
): ValidationResult {
  const { error } = schema.validate(body);
  if (error) {
    const { message, details } = error;
    return {
      value: message,
      error: { details: details.map((item) => ({ message: item.message })) },
    };
  }
}
